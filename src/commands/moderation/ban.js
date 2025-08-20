// Comando para banear a un usuario
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/functions');
const logger = require('../../utils/logger');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario que será baneado')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razon')
        .setDescription('Razón del baneo')
        .setRequired(false))
    .addIntegerOption(option =>
      option.setName('dias')
        .setDescription('Días de mensajes que serán eliminados (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  // Configuración del comando
  category: 'moderation',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    // Obtener opciones del comando
    const targetUser = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'No se proporcionó una razón';
    const deleteMessageDays = interaction.options.getInteger('dias') || 1;
    
    // Verificar que el bot tenga permisos para banear
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({
        content: '❌ No tengo permisos para banear miembros en este servidor.',
        ephemeral: true
      });
    }
    
    // Obtener el miembro objetivo
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    
    // Verificar si el usuario puede ser baneado
    if (targetMember) {
      // Verificar si el bot puede banear al usuario (jerarquía de roles)
      if (!targetMember.bannable) {
        return interaction.reply({
          content: '❌ No puedo banear a este usuario. Es posible que tenga un rol más alto que el mío o que sea el propietario del servidor.',
          ephemeral: true
        });
      }
      
      // Verificar si el moderador tiene un rol más alto que el usuario a banear
      if (targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.guild.ownerId !== interaction.user.id) {
        return interaction.reply({
          content: '❌ No puedes banear a este usuario porque tiene un rol igual o superior al tuyo.',
          ephemeral: true
        });
      }
    }
    
    try {
      // Banear al usuario
      await interaction.guild.members.ban(targetUser.id, {
        reason: `${interaction.user.tag}: ${reason}`,
        deleteMessageDays
      });
      
      // Crear embed de confirmación
      const embed = createEmbed({
        title: '🔨 Usuario Baneado',
        description: `**${targetUser.tag}** ha sido baneado del servidor.`,
        fields: [
          {
            name: '👤 Usuario',
            value: `${targetUser.tag} (${targetUser.id})`,
            inline: true
          },
          {
            name: '🛡️ Moderador',
            value: interaction.user.tag,
            inline: true
          },
          {
            name: '📝 Razón',
            value: reason
          }
        ],
        footer: {
          text: `ID: ${targetUser.id}`
        },
        timestamp: true
      });
      
      // Responder con el embed
      await interaction.reply({ embeds: [embed] });
      
      // Registrar la acción en los logs
      logger.info(`${interaction.user.tag} baneó a ${targetUser.tag} por: ${reason}`);
      
      // Enviar log al canal de moderación si está configurado
      const logChannelId = client.config.logChannels?.moderation;
      if (logChannelId) {
        const logChannel = interaction.guild.channels.cache.find(
          channel => channel.id === logChannelId || channel.name === logChannelId
        );
        
        if (logChannel) {
          logChannel.send({ embeds: [embed] }).catch(err => {
            logger.error(`Error al enviar log de baneo al canal: ${err.message}`);
          });
        }
      }
      
      // Intentar notificar al usuario baneado por DM
      try {
        const dmEmbed = createEmbed({
          title: '🔨 Has sido baneado',
          description: `Has sido baneado de **${interaction.guild.name}**.`,
          fields: [
            {
              name: '📝 Razón',
              value: reason
            },
            {
              name: '🛡️ Moderador',
              value: interaction.user.tag
            }
          ],
          timestamp: true
        });
        
        await targetUser.send({ embeds: [dmEmbed] });
      } catch (error) {
        // Ignorar errores al enviar DM (usuario puede tener DMs cerrados)
      }
    } catch (error) {
      logger.error(`Error al banear a ${targetUser.tag}: ${error.message}`);
      
      await interaction.reply({
        content: `❌ Ocurrió un error al banear al usuario: ${error.message}`,
        ephemeral: true
      });
    }
  }
};