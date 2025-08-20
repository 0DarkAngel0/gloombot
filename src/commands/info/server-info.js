import { SlashCommandBuilder } from 'discord.js';
import { e } from '../../utils/ui.js';
import { getGuildSettings } from '../../utils/store.js';

export default {
  data: new SlashCommandBuilder().setName('server-info').setDescription('Muestra información detallada del servidor'),
  category: 'info',
  async execute({ interaction }) {
    const g = interaction.guild;
    const guildSettings = getGuildSettings(g.id);
    const embed = e(guildSettings)
      .setAuthor({ name: g.name, iconURL: g.iconURL({ size: 256 }) ?? undefined })
      .addFields(
        { name: 'ID', value: g.id, inline: true },
        { name: 'Miembros', value: `${g.memberCount}`, inline: true },
        { name: 'Dueño', value: `<@${g.ownerId}>`, inline: true },
        { name: 'Creado', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Boosts', value: `${g.premiumSubscriptionCount ?? 0}`, inline: true },
        { name: 'Nivel', value: `${g.premiumTier}`, inline: true }
      )
      .setThumbnail(g.iconURL({ size: 256 }) ?? null);
    await interaction.reply({ embeds: [embed], ephemeral: guildSettings.ephemeral ?? true });
  }
};
