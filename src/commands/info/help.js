import { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType } from 'discord.js';
import { e, pageControls } from '../../utils/ui.js';
import { getGuildSettings } from '../../utils/store.js';

const CATEGORIES = {
  info: ['server-info', 'user-info', 'ping', 'avatar'],
  moderation: ['ban', 'kick', 'timeout', 'clear', 'slowmode', 'lock'],
  economy: ['balance', 'work', 'shop', 'buy', 'inventory', 'leaderboard'],
  fun: ['meme', 'rps', '8ball', 'minesweeper', 'trivia'],
  music: ['play', 'pause', 'skip', 'queue', 'loop', 'np'],
  ai: ['ai chat', 'ai prompt']
};

function pageEmbed(guildSettings, category, page = 0) {
  const items = CATEGORIES[category] || [];
  const perPage = 6;
  const start = page * perPage;
  const slice = items.slice(start, start + perPage);
  return e(guildSettings)
    .setTitle(`Ayuda — ${category}`)
    .setDescription(slice.map(c => `• \`/${c}\``).join('\n') || 'Sin comandos')
    .setFooter({ text: `Página ${page + 1}/${Math.max(1, Math.ceil(items.length / perPage))}` });
}

export default {
  data: new SlashCommandBuilder().setName('help').setDescription('Muestra la lista de comandos con categorías.')
    .addStringOption(o => o.setName('categoria').setDescription('Filtra por categoría')
      .addChoices(...Object.keys(CATEGORIES).map(k => ({ name: k, value: k })))),
  category: 'info',
  async execute({ interaction }) {
    const guildSettings = getGuildSettings(interaction.guildId);
    const ephemeral = guildSettings.ephemeral ?? true;

    const initial = interaction.options.getString('categoria') || 'info';
    let page = 0;

    const select = new StringSelectMenuBuilder()
      .setCustomId('help:select')
      .setPlaceholder('Selecciona una categoría')
      .addOptions(Object.keys(CATEGORIES).map(k => ({ label: k, value: k })));

    const msg = await interaction.reply({
      embeds: [pageEmbed(guildSettings, initial, page)],
      components: [new ActionRowBuilder().addComponents(select), pageControls('help', { hasPrev: false, hasNext: (CATEGORIES[initial]?.length || 0) > 6 })],
      ephemeral
    });

    let currentCat = initial;

    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120000 });
    const selectCollector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 120000 });

    selectCollector.on('collect', async i => {
      if (i.customId !== 'help:select') return;
      currentCat = i.values[0];
      page = 0;
      await i.update({
        embeds: [pageEmbed(guildSettings, currentCat, page)],
        components: [new ActionRowBuilder().addComponents(select.setPlaceholder(currentCat)), pageControls('help', { hasPrev: false, hasNext: (CATEGORIES[currentCat]?.length || 0) > 6 })]
      });
    });

    collector.on('collect', async i => {
      if (!i.customId.startsWith('help:')) return;
      const total = Math.ceil((CATEGORIES[currentCat]?.length || 0) / 6);
      if (i.customId.endsWith('prev')) page = Math.max(0, page - 1);
      if (i.customId.endsWith('next')) page = Math.min(total - 1, page + 1);
      if (i.customId.endsWith('close')) return i.update({ components: [] });
      await i.update({
        embeds: [pageEmbed(guildSettings, currentCat, page)],
        components: [new ActionRowBuilder().addComponents(select.setPlaceholder(currentCat)), pageControls('help', { hasPrev: page > 0, hasNext: page < total - 1 })]
      });
    });
  }
};
