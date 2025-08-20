// Comando para trabajar y ganar monedas
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, formatNumber, randomNumber } = require('../../utils/functions');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Trabaja para ganar monedas'),
  
  // Configuración del comando
  category: 'economy',
  cooldown: 3600, // 1 hora en segundos
  
  // Ejecución del comando
  async execute(client, interaction) {
    try {
      // Obtener configuración de economía
      const { workMinAmount, workMaxAmount } = client.config.economy;
      
      // Generar cantidad aleatoria de monedas ganadas
      const earned = randomNumber(workMinAmount, workMaxAmount);
      
      // Aquí iría la lógica para actualizar el balance del usuario en la base de datos
      // Por ahora, solo mostraremos el mensaje de éxito
      
      // Generar un mensaje aleatorio de trabajo
      const workMessages = [
        `Trabajaste como programador y arreglaste algunos bugs por ${earned} monedas.`,
        `Ayudaste a moderar un servidor de Discord y ganaste ${earned} monedas.`,
        `Creaste un bot de Discord para un cliente y recibiste ${earned} monedas.`,
        `Trabajaste como soporte técnico y ganaste ${earned} monedas.`,
        `Diseñaste un logo para una empresa y te pagaron ${earned} monedas.`,
        `Escribiste un artículo sobre tecnología y ganaste ${earned} monedas.`,
        `Transmitiste en vivo jugando videojuegos y recibiste ${earned} monedas en donaciones.`,
        `Editaste un video para YouTube y ganaste ${earned} monedas.`,
        `Tradujiste un documento importante y recibiste ${earned} monedas.`,
        `Diste clases particulares de programación y ganaste ${earned} monedas.`
      ];
      
      const randomMessage = workMessages[Math.floor(Math.random() * workMessages.length)];
      
      // Crear embed con la información
      const embed = createEmbed({
        title: '💼 ¡Has trabajado con éxito!',
        description: randomMessage,
        fields: [
          {
            name: '💰 Ganancia',
            value: `${formatNumber(earned)} monedas`
          },
          {
            name: '⏱️ Cooldown',
            value: 'Podrás volver a trabajar en 1 hora'
          }
        ],
        footer: {
          text: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        },
        timestamp: true
      });
      
      // Responder con el embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error en el comando work: ${error.message}`);
      
      await interaction.reply({
        content: '❌ Ocurrió un error al procesar tu trabajo. Por favor, inténtalo de nuevo más tarde.',
        ephemeral: true
      });
    }
  }
};