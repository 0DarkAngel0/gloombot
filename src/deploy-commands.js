// Script para registrar comandos slash en Discord API
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const logger = require('./utils/logger');

// Función principal para desplegar comandos
async function deployCommands() {
  const commands = [];
  const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
  
  // Recorrer todas las carpetas de comandos
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder))
      .filter(file => file.endsWith('.js'));
    
    // Cargar cada comando
    for (const file of commandFiles) {
      const command = require(path.join(__dirname, 'commands', folder, file));
      
      // Verificar si el comando tiene datos para slash command
      if (command.data) {
        commands.push(command.data.toJSON());
        logger.info(`Comando slash añadido: ${command.data.name}`);
      }
    }
  }
  
  // Configurar REST API
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  
  try {
    logger.info(`Iniciando despliegue de ${commands.length} comandos slash...`);
    
    // Modo de desarrollo (solo para un servidor específico)
    if (process.env.NODE_ENV === 'development' && process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      logger.info(`Comandos slash desplegados exitosamente en el servidor de desarrollo (ID: ${process.env.GUILD_ID})`);
    } 
    // Modo de producción (global para todos los servidores)
    else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      logger.info('Comandos slash desplegados globalmente con éxito');
    }
  } catch (error) {
    logger.error(`Error al desplegar comandos slash: ${error}`);
  }
}

// Ejecutar la función
deployCommands();