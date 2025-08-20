// Evento para manejar interacciones (comandos slash, botones, etc.)
const { InteractionType } = require('discord.js');
const logger = require('../utils/logger');
const { createEmbed, checkPermissions } = require('../utils/functions');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    // Manejar comandos slash
    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      
      // Si el comando no existe
      if (!command) return;
      
      // Verificar cooldowns
      const { cooldowns } = client;
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Map());
      }
      
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const cooldownAmount = (command.cooldown || 3) * 1000;
      
      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
        
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return interaction.reply({
            embeds: [createEmbed({
              title: '⏰ ¡Espera un momento!',
              description: `Por favor espera ${timeLeft.toFixed(1)} segundos antes de usar el comando \`${command.data.name}\` nuevamente.`,
              color: '#FF9900'
            })],
            ephemeral: true
          });
        }
      }
      
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      
      // Verificar permisos
      if (command.permissions && !checkPermissions(interaction.member, command.permissions)) {
        return interaction.reply({
          embeds: [createEmbed({
            title: '⛔ Permisos insuficientes',
            description: 'No tienes los permisos necesarios para usar este comando.',
            color: '#FF0000'
          })],
          ephemeral: true
        });
      }
      
      // Ejecutar el comando
      try {
        await command.execute(client, interaction);
        logger.info(`${interaction.user.tag} ejecutó el comando /${interaction.commandName}`);
      } catch (error) {
        logger.error(`Error al ejecutar el comando /${interaction.commandName}: ${error}`, client);
        
        // Responder al usuario
        const errorMessage = {
          embeds: [createEmbed({
            title: '❌ Error',
            description: 'Ocurrió un error al ejecutar este comando. El error ha sido registrado.',
            color: '#FF0000'
          })],
          ephemeral: true
        };
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }
    
    // Manejar interacciones de botones
    else if (interaction.isButton()) {
      // Obtener el ID del botón y procesarlo
      const [action, ...params] = interaction.customId.split('_');
      
      // Ejemplo de manejo de botones
      switch (action) {
        case 'help':
          // Lógica para botones de ayuda
          break;
          
        case 'economy':
          // Lógica para botones de economía
          break;
          
        case 'game':
          // Lógica para botones de juegos
          break;
          
        default:
          // Botón no reconocido
          break;
      }
    }
    
    // Manejar interacciones de menús de selección
    else if (interaction.isSelectMenu()) {
      // Obtener el ID del menú y los valores seleccionados
      const menuId = interaction.customId;
      const selected = interaction.values;
      
      // Ejemplo de manejo de menús
      switch (menuId) {
        case 'help_categories':
          // Lógica para menú de categorías de ayuda
          break;
          
        default:
          // Menú no reconocido
          break;
      }
    }
    
    // Manejar interacciones de modales
    else if (interaction.isModalSubmit()) {
      // Obtener el ID del modal y los valores
      const modalId = interaction.customId;
      
      // Ejemplo de manejo de modales
      switch (modalId) {
        case 'report_form':
          // Lógica para formulario de reportes
          break;
          
        default:
          // Modal no reconocido
          break;
      }
    }
  }
};