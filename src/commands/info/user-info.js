// Comando para mostrar información de un usuario
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, formatTime } = require('../../utils/functions');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('user-info')
    .setDescription('Muestra información detallada sobre un usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario del que quieres ver la información')
        .setRequired(false)),
  
  // Configuración del comando
  category: 'info',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    // Obtener el usuario objetivo (el mencionado o el autor del comando)
    const targetUser = interaction.options.getUser('usuario') || interaction.user;
    const member = interaction.guild.members.cache.get(targetUser.id);
    
    // Recopilar información del usuario
    const joinedAt = member ? member.joinedTimestamp : null;
    const roles = member ? member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => r)
      .slice(0, 15) : [];
    
    // Determinar el estado del usuario
    let status = 'Desconectado';
    let statusEmoji = '⚫';
    
    if (member && member.presence) {
      switch (member.presence.status) {
        case 'online':
          status = 'En línea';
          statusEmoji = '🟢';
          break;
        case 'idle':
          status = 'Ausente';
          statusEmoji = '🟡';
          break;
        case 'dnd':
          status = 'No molestar';
          statusEmoji = '🔴';
          break;
        case 'offline':
          status = 'Desconectado';
          statusEmoji = '⚫';
          break;
      }
    }
    
    // Determinar la plataforma del usuario
    let platform = 'Desconocida';
    if (member && member.presence) {
      if (member.presence.clientStatus) {
        const platforms = [];
        if (member.presence.clientStatus.desktop) platforms.push('💻 PC');
        if (member.presence.clientStatus.mobile) platforms.push('📱 Móvil');
        if (member.presence.clientStatus.web) platforms.push('🌐 Web');
        platform = platforms.join(', ') || 'Desconocida';
      }
    }
    
    // Crear embed con la información
    const embed = createEmbed({
      title: `${statusEmoji} Información de Usuario: ${targetUser.tag}`,
      thumbnail: targetUser.displayAvatarURL({ dynamic: true, size: 1024 }),
      fields: [
        {
          name: '📝 Información General',
          value: `**ID:** ${targetUser.id}\n` +
                 `**Tag:** ${targetUser.tag}\n` +
                 `**Creado:** <t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>\n` +
                 `**Bot:** ${targetUser.bot ? 'Sí' : 'No'}`
        },
        {
          name: '🖥️ Estado',
          value: `**Estado:** ${status}\n` +
                 `**Plataforma:** ${platform}`,
          inline: true
        }
      ],
      footer: {
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      }
    });
    
    // Añadir información específica del servidor si el usuario es miembro
    if (member) {
      embed.fields.push({
        name: '🏠 Información del Servidor',
        value: `**Apodo:** ${member.nickname || 'Ninguno'}\n` +
               `**Se unió:** ${joinedAt ? `<t:${Math.floor(joinedAt / 1000)}:R>` : 'Desconocido'}`,
        inline: true
      });
      
      if (roles.length > 0) {
        embed.fields.push({
          name: `🏅 Roles [${roles.length}]`,
          value: roles.length > 0 ? roles.slice(0, 15).join(', ') : 'Ninguno'
        });
      }
      
      // Añadir información de impulso si el usuario ha impulsado el servidor
      if (member.premiumSince) {
        embed.fields.push({
          name: '🚀 Impulso del Servidor',
          value: `**Impulsando desde:** <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`
        });
      }
    }
    
    // Responder con el embed
    await interaction.reply({ embeds: [embed] });
  }
};