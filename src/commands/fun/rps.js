// Comando para jugar piedra, papel o tijeras
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createEmbed } = require('../../utils/functions');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Juega a piedra, papel o tijeras contra el bot'),
  
  // Configuración del comando
  category: 'fun',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    // Crear los botones para las opciones
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('rps_rock')
          .setLabel('Piedra')
          .setEmoji('🪨')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('rps_paper')
          .setLabel('Papel')
          .setEmoji('📄')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('rps_scissors')
          .setLabel('Tijeras')
          .setEmoji('✂️')
          .setStyle(ButtonStyle.Primary)
      );
    
    // Crear embed inicial
    const embed = createEmbed({
      title: '🎮 Piedra, Papel o Tijeras',
      description: 'Elige una opción para jugar contra mí.',
      footer: {
        text: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      }
    });
    
    // Enviar mensaje con los botones
    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });
    
    // Crear colector de interacciones para los botones
    const filter = i => i.customId.startsWith('rps_') && i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: 30000 });
    
    collector.on('collect', async i => {
      // Obtener la elección del usuario
      const userChoice = i.customId.replace('rps_', '');
      
      // Opciones posibles
      const choices = ['rock', 'paper', 'scissors'];
      
      // Elección aleatoria del bot
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      
      // Emojis para las elecciones
      const emojis = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
      };
      
      // Nombres en español
      const names = {
        rock: 'Piedra',
        paper: 'Papel',
        scissors: 'Tijeras'
      };
      
      // Determinar el resultado
      let result;
      if (userChoice === botChoice) {
        result = 'Empate';
      } else if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
      ) {
        result = '¡Has ganado!';
      } else {
        result = '¡Has perdido!';
      }
      
      // Crear embed con el resultado
      const resultEmbed = createEmbed({
        title: `🎮 ${result}`,
        description: `**Tu elección:** ${emojis[userChoice]} ${names[userChoice]}\n` +
                     `**Mi elección:** ${emojis[botChoice]} ${names[botChoice]}`,
        color: result === '¡Has ganado!' ? '#00FF00' : result === '¡Has perdido!' ? '#FF0000' : '#FFFF00',
        footer: {
          text: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        }
      });
      
      // Crear botón para jugar de nuevo
      const newRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('rps_again')
            .setLabel('Jugar de nuevo')
            .setStyle(ButtonStyle.Success)
        );
      
      // Actualizar el mensaje con el resultado
      await i.update({
        embeds: [resultEmbed],
        components: [newRow]
      });
      
      // Detener el colector actual
      collector.stop();
    });
    
    collector.on('end', (collected, reason) => {
      if (reason === 'time' && collected.size === 0) {
        // Si el tiempo se agotó y no se recogió ninguna interacción
        const timeoutEmbed = createEmbed({
          title: '⏱️ Tiempo agotado',
          description: 'No elegiste ninguna opción a tiempo.',
          color: '#FF0000',
          footer: {
            text: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
          }
        });
        
        // Actualizar el mensaje con el embed de tiempo agotado y sin botones
        interaction.editReply({
          embeds: [timeoutEmbed],
          components: []
        }).catch(console.error);
      }
    });
  }
};