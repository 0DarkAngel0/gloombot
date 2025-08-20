import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import { e } from '../../utils/ui.js';
import { getGuildSettings } from '../../utils/store.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Elimina N mensajes del canal actual')
    .addIntegerOption(o => o.setName('cantidad').setDescription('Número de mensajes (1-100)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  category: 'moderation',
  async execute({ interaction }) {
    const cnt = interaction.options.getInteger('cantidad');
    if (cnt < 1 || cnt > 100) return interaction.reply({ content: 'La cantidad debe ser entre 1 y 100.', ephemeral: true });

    const guildSettings = getGuildSettings(interaction.guildId);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('clear:yes').setLabel(`Eliminar ${cnt}`).setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('clear:no').setLabel('Cancelar').setStyle(ButtonStyle.Secondary)
    );
    await interaction.reply({ embeds: [e(guildSettings).setDescription(`¿Confirmas eliminar **${cnt}** mensajes?`)], components: [row], ephemeral: true });

    const pick = await interaction.channel.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 15000 }).catch(() => null);
    if (!pick) return interaction.editReply({ content: 'Tiempo agotado.', embeds: [], components: [] });

    if (pick.customId === 'clear:no') return pick.update({ content: 'Cancelado.', embeds: [], components: [] });

    const deleted = await interaction.channel.bulkDelete(cnt, true).catch(() => 0);
    await pick.update({ embeds: [e(guildSettings).setDescription(`🧹 Eliminados **${deleted}** mensajes.`)], components: [] });
  }
};
