// Importaciones principales
const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Importar módulo keep_alive para Replit
const keepAlive = require('./utils/keep_alive');

// Importar utilidades y configuración
const config = require('./config/config.json');
const logger = require('./utils/logger');

// Crear una nueva instancia del cliente con los intents necesarios
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// Colecciones para almacenar comandos y aliases
client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.config = config;

// Función para cargar comandos
const loadCommands = (dir = 'commands') => {
  const commandFolders = fs.readdirSync(path.join(__dirname, dir));
  
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, dir, folder))
      .filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(path.join(__dirname, dir, folder, file));
      
      // Registrar comando slash
      if (command.data) {
        client.slashCommands.set(command.data.name, command);
      }
      
      // Registrar comando de prefijo (legacy)
      if (command.name) {
        client.commands.set(command.name, command);
        logger.info(`Comando cargado: ${command.name}`);
        
        // Registrar aliases si existen
        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach(alias => {
            client.aliases.set(alias, command.name);
          });
        }
      }
    }
  }
};

// Función para cargar eventos
const loadEvents = (dir = 'events') => {
  const eventFiles = fs.readdirSync(path.join(__dirname, dir))
    .filter(file => file.endsWith('.js'));
  
  for (const file of eventFiles) {
    const event = require(path.join(__dirname, dir, file));
    const eventName = file.split('.')[0];
    
    if (event.once) {
      client.once(eventName, (...args) => event.execute(client, ...args));
    } else {
      client.on(eventName, (...args) => event.execute(client, ...args));
    }
    
    logger.info(`Evento cargado: ${eventName}`);
  }
};

// Función para registrar comandos slash en Discord API
const deployCommands = async () => {
  try {
    const commands = [];
    client.slashCommands.forEach(command => {
      commands.push(command.data.toJSON());
    });
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    
    logger.info('Iniciando despliegue de comandos slash...');
    
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    
    logger.info(`¡${commands.length} comandos slash desplegados exitosamente!`);
  } catch (error) {
    logger.error(`Error al desplegar comandos slash: ${error}`);
  }
};

// Inicializar el bot
const init = async () => {
  try {
    // Iniciar servidor web para mantener el bot activo en Replit
    keepAlive();
    
    // Cargar comandos y eventos
    loadCommands();
    loadEvents();
    
    // Iniciar sesión con el token
    await client.login(process.env.TOKEN);
    
    // Desplegar comandos slash después de iniciar sesión
    await deployCommands();
    
    logger.info('Bot iniciado correctamente');
  } catch (error) {
    logger.error(`Error al iniciar el bot: ${error}`);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', error => {
  logger.error(`Error no manejado: ${error}`);
});

process.on('uncaughtException', error => {
  logger.error(`Excepción no capturada: ${error}`);
  process.exit(1);
});

// Iniciar el bot
init();