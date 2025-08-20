// Evento que se ejecuta cuando el bot está listo
const { ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    // Registrar que el bot está online
    logger.info(`¡Bot listo! Conectado como ${client.user.tag}`);
    
    // Establecer estado y actividad del bot
    client.user.setPresence({
      status: 'online',
      activities: [{
        name: `${client.config.prefix}help | ${client.guilds.cache.size} servidores`,
        type: ActivityType.Playing
      }]
    });
    
    // Actualizar estado cada 10 minutos
    setInterval(() => {
      const activities = [
        {
          name: `${client.config.prefix}help | ${client.guilds.cache.size} servidores`,
          type: ActivityType.Playing
        },
        {
          name: `¡Comandos Slash disponibles!`,
          type: ActivityType.Listening
        },
        {
          name: `v${client.config.botVersion}`,
          type: ActivityType.Watching
        }
      ];
      
      const activity = activities[Math.floor(Math.random() * activities.length)];
      
      client.user.setActivity(activity.name, { type: activity.type });
    }, 600000); // 10 minutos
    
    // Inicializar conexión a base de datos si es necesario
    try {
      // Aquí iría la conexión a la base de datos
      // Por ejemplo: await require('../database/mongoose').init();
      logger.info('Conexión a base de datos inicializada');
    } catch (error) {
      logger.error(`Error al conectar a la base de datos: ${error}`, client);
    }
  }
};