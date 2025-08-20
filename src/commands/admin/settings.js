import { SlashCommandBuilder } from 'discord.js';
import { getGuildSettings, setGuildSettings } from '../../utils/store.js';

export default {
  data: new SlashCommandBuilder().setName('settings').setDescription('Configura la interfaz del bot en este servidor')
    .addSubcommand(s => s.setName('ephemeral').setDescription('Respuestas efímeras por defecto')
      .addBooleanOption(o => o.setName('activo').setDescription('true = efímero').setRequired(true)))
    .addSubcommand(s => s.setName('color').setDescription('Color hexadecimal de los embeds (ej: 0x8a2be2)')
      .addStringOption(o => o.setName('hex').setDescription('Ej: 0xffaa00').setRequired(true)))
    .addSubcommand(s => s.setName('footer').setDescription('Texto de pie de página')
      .addStringOption(o => o.setName('texto').setDescription('Texto').setRequired(true))
      .addStringOption(o => o.setName('icono').setDescription('URL del icono').setRequired(false)))
    .addSubcommand(s => s.setName('language').setDescription('Idioma de las respuestas')
      .addStringOption(o => o.setName('code').setDescription('es | en').addChoices({ name: 'Español', value: 'es' }, { name: 'English', value: 'en' }).setRequired(true))),
  category: 'admin',
  async execute({ interaction }) {
    const sub = interaction.options.getSubcommand();
    const g = interaction.guildId;
    if (sub === 'ephemeral') {
      const val = interaction.options.getBoolean('activo');
      setGuildSettings(g, { ephemeral: val });
      return interaction.reply({ content: `Respuestas efímeras: **${val ? 'ON' : 'OFF'}**`, ephemeral: true });
    }
    if (sub === 'color') {
      const hex = interaction.options.getString('hex');
      const color = Number(hex);
      if (Number.isNaN(color)) return interaction.reply({ content: 'Formato inválido. Usa, por ejemplo, `0x8a2be2`.', ephemeral: true });
      setGuildSettings(g, { theme: { color } });
      return interaction.reply({ content: `Color actualizado a **${hex}**.`, ephemeral: true });
    }
    if (sub === 'footer') {
      const text = interaction.options.getString('texto');
      const iconURL = interaction.options.getString('icono') || null;
      setGuildSettings(g, { theme: { footer: iconURL ? { text, iconURL } : { text } } });
      return interaction.reply({ content: 'Footer actualizado.', ephemeral: true });
    }
    if (sub === 'language') {
      const code = interaction.options.getString('code');
      setGuildSettings(g, { language: code });
      return interaction.reply({ content: `Idioma establecido a **${code}**.`, ephemeral: true });
    }
  }
};
