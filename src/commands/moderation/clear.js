// Comando para limpiar mensajes del chat
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/functions');
const logger = require('../../utils/logger');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina una cantidad específica de mensajes del canal')
    .addIntegerOption(option =>
      option.setName('cantidad')
        .setDescription('Número de mensajes a eliminar (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Eliminar mensajes solo de este usuario')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  // Configuración del comando
  category: 'moderation',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    // Obtener opciones del comando
    const amount = interaction.options.getInteger('cantidad');
    const targetUser = interaction.options.getUser('usuario');
    
    // Verificar que el bot tenga permisos para eliminar mensajes
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: '❌ No tengo permisos para eliminar mensajes en este canal.',
        ephemeral: true
      });
    }
    
    try {
      // Diferir la respuesta para tener tiempo de procesar
      await interaction.deferReply({ ephemeral: true });
      
      // Obtener mensajes del canal
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      
      // Filtrar mensajes según los criterios
      let messagesToDelete = messages;
      
      // Si se especificó un usuario, filtrar solo sus mensajes
      if (targetUser) {
        messagesToDelete = messages.filter(msg => msg.author.id === targetUser.id);
      }
      
      // Filtrar mensajes que no tengan más de 14 días (limitación de Discord)
      messagesToDelete = messagesToDelete.filter(msg => {
        return (Date.now() - msg.createdTimestamp) < 1209600000; // 14 días en milisegundos
      });
      
      // Limitar a la cantidad especificada
      messagesToDelete = [...messagesToDelete.values()].slice(0, amount);
      
      // Verificar si hay mensajes para eliminar
      if (messagesToDelete.length === 0) {
        return interaction.followUp({
          content: targetUser
            ? `❌ No se encontraron mensajes recientes de ${targetUser.tag} para eliminar.`
            : '❌ No se encontraron mensajes recientes para eliminar.',
          ephemeral: true
        });
      }
      
      // Eliminar los mensajes
      const deletedCount = await interaction.channel.bulkDelete(messagesToDelete, true)
        .then(deleted => deleted.size)
        .catch(() => 0);
      
      // Crear embed con la confirmación
      const embed = createEmbed({
        title: '🧹 Mensajes Eliminados',
        description: `Se han eliminado **${deletedCount}** mensajes${targetUser ? ` de **${targetUser.tag}**` : ''}.`,
        color: '#00FF00',
        footer: {
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        },
        timestamp: true
      });
      
      // Responder con el embed
      await interaction.followUp({
        embeds: [embed],
        ephemeral: true
      });
      
      // Registrar la acción en los logs
      logger.info(`${interaction.user.tag} eliminó ${deletedCount} mensajes${targetUser ? ` de ${targetUser.tag}` : ''} en #${interaction.channel.name}`);
      
      // Enviar log al canal de moderación si está configurado
      const logChannelId = client.config.logChannels?.moderation;
      if (logChannelId) {
        const logChannel = interaction.guild.channels.cache.find(
          channel => channel.id === logChannelId || channel.name === logChannelId
        );
        
        if (logChannel) {
          logChannel.send({ embeds: [embed] }).catch(err => {
            logger.error(`Error al enviar log de limpieza al canal: ${err.message}`);
          });
        }
      }
    } catch (error) {
      logger.error(`Error al limpiar mensajes: ${error.message}`);
      
      await interaction.followUp({
        content: `❌ Ocurrió un error al eliminar los mensajes: ${error.message}`,
        ephemeral: true
      });
    }
  }
};