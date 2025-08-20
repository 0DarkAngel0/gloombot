// Evento para manejar mensajes y comandos de prefijo
const { ChannelType } = require('discord.js');
const logger = require('../utils/logger');
const { createEmbed, checkPermissions } = require('../utils/functions');

module.exports = {
  name: 'messageCreate',
  async execute(client, message) {
    // Ignorar mensajes de bots y webhooks
    if (message.author.bot || message.webhookId) return;
    
    // Ignorar mensajes que no son de servidores (DMs)
    if (message.channel.type === ChannelType.DM) return;
    
    // Obtener el prefijo del bot
    const prefix = client.config.prefix;
    
    // Verificar si el mensaje comienza con el prefijo
    if (!message.content.startsWith(prefix)) {
      // Aquí se puede implementar funcionalidades de auto-moderación
      // Por ejemplo: detectar spam, links no permitidos, etc.
      return;
    }
    
    // Extraer argumentos y nombre del comando
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Buscar el comando por nombre o alias
    const command = 
      client.commands.get(commandName) ||
      client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    // Si el comando no existe
    if (!command) return;
    
    // Verificar si el comando requiere argumentos
    if (command.args && !args.length) {
      let reply = `No proporcionaste ningún argumento, ${message.author}!`;
      
      // Si hay un ejemplo de uso, mostrarlo
      if (command.usage) {
        reply += `\nEl uso correcto sería: \`${prefix}${command.name} ${command.usage}\``;
      }
      
      return message.reply({
        embeds: [createEmbed({
          title: '⚠️ Argumentos faltantes',
          description: reply,
          color: '#FF9900'
        })]
      });
    }
    
    // Verificar cooldowns
    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Map());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply({
          embeds: [createEmbed({
            title: '⏰ ¡Espera un momento!',
            description: `Por favor espera ${timeLeft.toFixed(1)} segundos antes de usar el comando \`${command.name}\` nuevamente.`,
            color: '#FF9900'
          })]
        });
      }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    // Verificar permisos
    if (command.permissions && !checkPermissions(message.member, command.permissions)) {
      return message.reply({
        embeds: [createEmbed({
          title: '⛔ Permisos insuficientes',
          description: 'No tienes los permisos necesarios para usar este comando.',
          color: '#FF0000'
        })]
      });
    }
    
    // Ejecutar el comando
    try {
      await command.execute(client, message, args);
      logger.info(`${message.author.tag} ejecutó el comando ${prefix}${command.name}`);
    } catch (error) {
      logger.error(`Error al ejecutar el comando ${prefix}${command.name}: ${error}`, client);
      
      message.reply({
        embeds: [createEmbed({
          title: '❌ Error',
          description: 'Ocurrió un error al ejecutar este comando. El error ha sido registrado.',
          color: '#FF0000'
        })]
      });
    }
  }
};