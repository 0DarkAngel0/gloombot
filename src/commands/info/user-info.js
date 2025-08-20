import { SlashCommandBuilder } from 'discord.js';
import { e } from '../../utils/ui.js';
import { getGuildSettings } from '../../utils/store.js';

export default {
  data: new SlashCommandBuilder()
    .setName('user-info')
    .setDescription('Muestra información de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a inspeccionar').setRequired(false)),
  category: 'info',
  async execute({ interaction }) {
    const guildSettings = getGuildSettings(interaction.guildId);
    const user = interaction.options.getUser('usuario') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = e(guildSettings)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Cuenta', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        member ? { name: 'Se unió', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true } : { name: '\u200b', value: '\u200b', inline: true },
        member ? { name: 'Roles', value: member.roles.cache.filter(r => r.name !== '@everyone').map(r => r.toString()).slice(0, 10).join(' ') || '—' } : { name: 'Roles', value: '—' }
      );
    await interaction.reply({ embeds: [embed], ephemeral: guildSettings.ephemeral ?? true });
  }
};
