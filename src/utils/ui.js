// Utilidades de UI: tema, embeds, filas de botones, paginación.
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export const defaultTheme = {
  color: 0x8a2be2, // morado premium
  footer: { text: 'GloomBot', iconURL: 'https://i.imgur.com/3yKX1.png' }, // cambia el icono
};

export function themeFor(guildSettings) {
  return { ...defaultTheme, ...(guildSettings?.theme || {}) };
}

export function e(guildSettings) {
  const t = themeFor(guildSettings);
  const base = new EmbedBuilder().setColor(t.color);
  if (t.footer) base.setFooter(t.footer);
  return base;
}

export function pageControls(id, { hasPrev, hasNext }) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`${id}:prev`).setEmoji('◀️').setStyle(ButtonStyle.Secondary).setDisabled(!hasPrev),
    new ButtonBuilder().setCustomId(`${id}:next`).setEmoji('▶️').setStyle(ButtonStyle.Secondary).setDisabled(!hasNext),
    new ButtonBuilder().setCustomId(`${id}:close`).setEmoji('🗑️').setStyle(ButtonStyle.Danger)
  );
}
