// Comando para expulsar a un usuario
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/functions');
const logger = require('../../utils/logger');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario que será expulsado')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('razon')
        .setDescription('Razón de la expulsión')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  // Configuración del comando
  category: 'moderation',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    // Obtener opciones del comando
    const targetUser = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'No se proporcionó una razón';
    
    // Verificar que el bot tenga permisos para expulsar
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({
        content: '❌ No tengo permisos para expulsar miembros en este servidor.',
        ephemeral: true
      });
    }
    
    // Obtener el miembro objetivo
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    
    // Verificar si el usuario existe en el servidor
    if (!targetMember) {
      return interaction.reply({
        content: '❌ Este usuario no se encuentra en el servidor.',
        ephemeral: true
      });
    }
    
    // Verificar si el usuario puede ser expulsado
    if (!targetMember.kickable) {
      return interaction.reply({
        content: '❌ No puedo expulsar a este usuario. Es posible que tenga un rol más alto que el mío o que sea el propietario del servidor.',
        ephemeral: true
      });
    }
    
    // Verificar si el moderador tiene un rol más alto que el usuario a expulsar
    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.guild.ownerId !== interaction.user.id) {
      return interaction.reply({
        content: '❌ No puedes expulsar a este usuario porque tiene un rol igual o superior al tuyo.',
        ephemeral: true
      });
    }
    
    try {
      // Intentar notificar al usuario expulsado por DM
      try {
        const dmEmbed = createEmbed({
          title: '👢 Has sido expulsado',
          description: `Has sido expulsado de **${interaction.guild.name}**.`,
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
      
      // Expulsar al usuario
      await targetMember.kick(`${interaction.user.tag}: ${reason}`);
      
      // Crear embed de confirmación
      const embed = createEmbed({
        title: '👢 Usuario Expulsado',
        description: `**${targetUser.tag}** ha sido expulsado del servidor.`,
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
      logger.info(`${interaction.user.tag} expulsó a ${targetUser.tag} por: ${reason}`);
      
      // Enviar log al canal de moderación si está configurado
      const logChannelId = client.config.logChannels?.moderation;
      if (logChannelId) {
        const logChannel = interaction.guild.channels.cache.find(
          channel => channel.id === logChannelId || channel.name === logChannelId
        );
        
        if (logChannel) {
          logChannel.send({ embeds: [embed] }).catch(err => {
            logger.error(`Error al enviar log de expulsión al canal: ${err.message}`);
          });
        }
      }
    } catch (error) {
      logger.error(`Error al expulsar a ${targetUser.tag}: ${error.message}`);
      
      await interaction.reply({
        content: `❌ Ocurrió un error al expulsar al usuario: ${error.message}`,
        ephemeral: true
      });
    }
  }
};