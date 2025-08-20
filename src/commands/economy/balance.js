import { SlashCommandBuilder } from 'discord.js';
import { e } from '../../utils/ui.js';
import { getGuildSettings } from '../../utils/store.js';
import { getBalanceFor } from '../../utils/economy.js'; // implementa tu store real

function progress(current, goal = 1000, width = 16) {
  const ratio = Math.min(1, current / goal);
  const filled = Math.round(ratio * width);
  return '▰'.repeat(filled) + '▱'.repeat(Math.max(0, width - filled));
}

export default {
  data: new SlashCommandBuilder().setName('balance').setDescription('Muestra tu balance'),
  category: 'economy',
  async execute({ interaction }) {
    const guildSettings = getGuildSettings(interaction.guildId);
    const bal = await getBalanceFor(interaction.user.id, interaction.guildId); // { coins, goal? }
    const goal = bal.goal ?? 1000;
    const embed = e(guildSettings)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTitle('Tu balance')
      .addFields(
        { name: 'Monedas', value: `${bal.coins} 💰`, inline: true },
        { name: 'Meta', value: `${goal}`, inline: true },
        { name: 'Progreso', value: `\`${progress(bal.coins, goal)}\``, inline: false }
      );
    await interaction.reply({ embeds: [embed], ephemeral: guildSettings.ephemeral ?? true });
  }
};
