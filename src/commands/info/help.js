// Comando para mostrar la ayuda y lista de comandos
const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/functions');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra la lista de comandos disponibles')
    .addStringOption(option =>
      option.setName('comando')
        .setDescription('Nombre del comando específico del que quieres información')
        .setRequired(false)),
  
  // Configuración del comando
  category: 'info',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    const commandName = interaction.options.getString('comando');
    
    // Si se especificó un comando, mostrar información detallada de ese comando
    if (commandName) {
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      
      if (!command) {
        return interaction.reply({
          content: `❌ No se encontró el comando \`${commandName}\`.`,
          ephemeral: true
        });
      }
      
      const embed = createEmbed({
        title: `Comando: ${command.data.name}`,
        description: command.data.description || 'Sin descripción',
        fields: [
          {
            name: '📂 Categoría',
            value: command.category || 'Sin categoría',
            inline: true
          },
          {
            name: '⏱️ Cooldown',
            value: `${command.cooldown || 3} segundos`,
            inline: true
          }
        ]
      });
      
      // Añadir opciones si el comando las tiene
      const options = command.data.options;
      if (options && options.length > 0) {
        embed.fields.push({
          name: '🔧 Opciones',
          value: options.map(opt => `\`${opt.name}\` - ${opt.description}`).join('\n')
        });
      }
      
      return interaction.reply({ embeds: [embed] });
    }
    
    // Si no se especificó un comando, mostrar lista de categorías y comandos
    // Obtener todas las categorías de comandos
    const categories = new Set();
    client.commands.forEach(cmd => {
      if (cmd.category) categories.add(cmd.category);
    });
    
    // Crear embed con información general
    const embed = createEmbed({
      title: '📚 Centro de Ayuda',
      description: 'Selecciona una categoría del menú desplegable para ver los comandos disponibles.',
      fields: [
        {
          name: '🤖 Información del Bot',
          value: `**Prefijo:** \`/\` (Slash Commands)\n` +
                 `**Comandos totales:** ${client.commands.size}\n` +
                 `**Categorías:** ${categories.size}`
        },
        {
          name: '🔗 Enlaces Útiles',
          value: `[Invitar Bot](${client.config.inviteLink}) | [Servidor de Soporte](${client.config.supportServer})`
        }
      ],
      footer: {
        text: 'Tip: Usa /help [comando] para ver información detallada de un comando específico'
      }
    });
    
    // Crear menú desplegable con las categorías
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_category')
          .setPlaceholder('Selecciona una categoría')
          .addOptions(Array.from(categories).map(category => ({
            label: category.charAt(0).toUpperCase() + category.slice(1),
            description: `Ver comandos de ${category}`,
            value: category,
            emoji: getCategoryEmoji(category)
          })))
      );
    
    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};

// Función para obtener el emoji correspondiente a cada categoría
function getCategoryEmoji(category) {
  const emojis = {
    'info': '📊',
    'moderation': '🛡️',
    'economy': '💰',
    'fun': '🎮',
    'utility': '🔧',
    'music': '🎵',
    'admin': '⚙️'
  };
  
  return emojis[category] || '❓';
}