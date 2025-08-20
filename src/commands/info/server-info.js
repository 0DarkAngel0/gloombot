// Comando para mostrar información del servidor
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed, formatNumber, formatTime } = require('../../utils/functions');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('server-info')
    .setDescription('Muestra información detallada sobre el servidor'),
  
  // Configuración del comando
  category: 'info',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    const guild = interaction.guild;
    
    // Obtener estadísticas del servidor
    const totalMembers = guild.memberCount;
    const onlineMembers = guild.members.cache.filter(m => m.presence?.status === 'online').size;
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categoryChannels = guild.channels.cache.filter(c => c.type === 4).size;
    const totalRoles = guild.roles.cache.size - 1; // Restar el rol @everyone
    const totalEmojis = guild.emojis.cache.size;
    const totalStickers = guild.stickers?.cache.size || 0;
    const boostLevel = guild.premiumTier ? `Nivel ${guild.premiumTier}` : 'Ninguno';
    const boostCount = guild.premiumSubscriptionCount || 0;
    
    // Crear embed con la información
    const embed = createEmbed({
      title: `📊 Información del Servidor: ${guild.name}`,
      thumbnail: guild.iconURL({ dynamic: true, size: 1024 }),
      fields: [
        {
          name: '📝 Información General',
          value: `**ID:** ${guild.id}\n` +
                 `**Propietario:** <@${guild.ownerId}>\n` +
                 `**Creado:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>\n` +
                 `**Región:** ${guild.preferredLocale || 'Desconocida'}`
        },
        {
          name: '👥 Miembros',
          value: `**Total:** ${formatNumber(totalMembers)}\n` +
                 `**En línea:** ${formatNumber(onlineMembers)}\n` +
                 `**Bots:** ${formatNumber(guild.members.cache.filter(m => m.user.bot).size)}`,
          inline: true
        },
        {
          name: '💬 Canales',
          value: `**Texto:** ${formatNumber(textChannels)}\n` +
                 `**Voz:** ${formatNumber(voiceChannels)}\n` +
                 `**Categorías:** ${formatNumber(categoryChannels)}`,
          inline: true
        },
        {
          name: '✨ Personalización',
          value: `**Roles:** ${formatNumber(totalRoles)}\n` +
                 `**Emojis:** ${formatNumber(totalEmojis)}\n` +
                 `**Stickers:** ${formatNumber(totalStickers)}`,
          inline: true
        },
        {
          name: '🚀 Mejoras del Servidor',
          value: `**Nivel de Boost:** ${boostLevel}\n` +
                 `**Cantidad de Boosts:** ${formatNumber(boostCount)}\n` +
                 `**Mejoradores:** ${formatNumber(guild.members.cache.filter(m => m.premiumSince).size)}`
        }
      ],
      footer: {
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      }
    });
    
    // Responder con el embed
    await interaction.reply({ embeds: [embed] });
  }
};