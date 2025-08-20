// Comando para ver el balance de economía
const { SlashCommandBuilder } = require('discord.js');
const { createEmbed, formatNumber } = require('../../utils/functions');

module.exports = {
  // Definición del comando slash
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Muestra tu balance actual o el de otro usuario')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuario del que quieres ver el balance')
        .setRequired(false)),
  
  // Configuración del comando
  category: 'economy',
  cooldown: 5,
  
  // Ejecución del comando
  async execute(client, interaction) {
    // Obtener el usuario objetivo (el mencionado o el autor del comando)
    const targetUser = interaction.options.getUser('usuario') || interaction.user;
    
    try {
      // Aquí iría la lógica para obtener el balance del usuario desde la base de datos
      // Por ahora, usaremos datos de ejemplo
      
      // Simulación de obtención de datos (esto se reemplazaría con consultas a la base de datos)
      const userData = {
        balance: 1500, // Monedas en el bolsillo
        bank: 5000,    // Monedas en el banco
        // Estos valores serían reemplazados por datos reales de la base de datos
      };
      
      // Calcular el total
      const totalBalance = userData.balance + userData.bank;
      
      // Crear embed con la información
      const embed = createEmbed({
        title: `💰 Balance de ${targetUser.username}`,
        thumbnail: targetUser.displayAvatarURL({ dynamic: true }),
        fields: [
          {
            name: '💵 Efectivo',
            value: `${formatNumber(userData.balance)} monedas`,
            inline: true
          },
          {
            name: '🏦 Banco',
            value: `${formatNumber(userData.bank)} monedas`,
            inline: true
          },
          {
            name: '💎 Total',
            value: `${formatNumber(totalBalance)} monedas`
          }
        ],
        footer: {
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        }
      });
      
      // Responder con el embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Error al obtener el balance: ${error.message}`);
      
      await interaction.reply({
        content: '❌ Ocurrió un error al obtener el balance. Por favor, inténtalo de nuevo más tarde.',
        ephemeral: true
      });
    }
  }
};