// Comando para mostrar memes aleatorios
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/functions');
const fetch = require('node-fetch');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Muestra un meme aleatorio')
    .addStringOption(option =>
      option.setName('categoria')
        .setDescription('Categoría del meme')
        .setRequired(false)
        .addChoices(
          { name: 'Programación', value: 'programming' },
          { name: 'Memes en español', value: 'spanish' },
          { name: 'Animales', value: 'animals' },
          { name: 'Videojuegos', value: 'gaming' },
          { name: 'Aleatorio', value: 'random' }
        )),
  
  // Configuración del comando
  category: 'fun',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    // Obtener la categoría seleccionada o usar 'random' por defecto
    const category = interaction.options.getString('categoria') || 'random';
    
    // Mostrar que el bot está procesando
    await interaction.deferReply();
    
    try {
      // Obtener un meme según la categoría
      let apiUrl = 'https://meme-api.com/gimme';
      
      // Añadir subreddit según la categoría
      switch (category) {
        case 'programming':
          apiUrl = 'https://meme-api.com/gimme/ProgrammerHumor';
          break;
        case 'spanish':
          apiUrl = 'https://meme-api.com/gimme/SpanishMeme';
          break;
        case 'animals':
          apiUrl = 'https://meme-api.com/gimme/wholesomememes';
          break;
        case 'gaming':
          apiUrl = 'https://meme-api.com/gimme/gamingmemes';
          break;
        default:
          // Usar URL por defecto para memes aleatorios
          break;
      }
      
      // Realizar la petición a la API
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Error al obtener meme: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Crear embed con el meme
      const embed = createEmbed({
        title: data.title,
        image: data.url,
        color: '#FF9900',
        footer: {
          text: `👍 ${data.ups || 0} | Fuente: ${data.subreddit || 'Desconocida'}`
        }
      });
      
      // Responder con el embed
      await interaction.followUp({
        embeds: [embed],
        components: [
          {
            type: 1, // ActionRow
            components: [
              {
                type: 2, // Button
                style: 5, // Link
                label: 'Ver en Reddit',
                url: data.postLink || 'https://reddit.com'
              },
              {
                type: 2, // Button
                style: 2, // Secondary
                label: 'Otro meme',
                custom_id: `meme_${category}`
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('Error en comando meme:', error);
      
      // Responder con mensaje de error
      const errorEmbed = createEmbed({
        title: '❌ Error',
        description: 'No se pudo obtener un meme. Por favor, intenta de nuevo más tarde.',
        color: '#FF0000'
      });
      
      if (interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  }
};