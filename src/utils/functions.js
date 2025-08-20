// Utilidades y funciones comunes para el bot
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config/config.json');

/**
 * Crea un embed con el estilo predeterminado del bot
 * @param {Object} options - Opciones para el embed
 * @returns {EmbedBuilder} El embed creado
 */
function createEmbed(options = {}) {
  const embed = new EmbedBuilder()
    .setColor(options.color || config.embedColor)
    .setTimestamp();
  
  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.thumbnail) embed.setThumbnail(options.thumbnail);
  if (options.image) embed.setImage(options.image);
  if (options.author) embed.setAuthor(options.author);
  if (options.footer) {
    embed.setFooter({ 
      text: options.footer.text || config.footerText, 
      iconURL: options.footer.iconURL 
    });
  } else {
    embed.setFooter({ text: config.footerText });
  }
  
  if (options.fields && Array.isArray(options.fields)) {
    options.fields.forEach(field => {
      embed.addFields({ name: field.name, value: field.value, inline: field.inline || false });
    });
  }
  
  return embed;
}

/**
 * Crea una fila de botones para interacciones
 * @param {Array} buttons - Array de configuraciones de botones
 * @returns {ActionRowBuilder} Fila de botones
 */
function createButtonRow(buttons) {
  const row = new ActionRowBuilder();
  
  buttons.forEach(button => {
    const btn = new ButtonBuilder()
      .setCustomId(button.id)
      .setLabel(button.label)
      .setStyle(button.style || ButtonStyle.Primary);
    
    if (button.emoji) btn.setEmoji(button.emoji);
    if (button.url) {
      btn.setURL(button.url);
      btn.setStyle(ButtonStyle.Link);
    }
    if (button.disabled) btn.setDisabled(true);
    
    row.addComponents(btn);
  });
  
  return row;
}

/**
 * Formatea un número con separadores de miles
 * @param {Number} num - El número a formatear
 * @returns {String} Número formateado
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Genera un número aleatorio entre min y max (inclusive)
 * @param {Number} min - Valor mínimo
 * @param {Number} max - Valor máximo
 * @returns {Number} Número aleatorio
 */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convierte milisegundos a un formato legible
 * @param {Number} ms - Milisegundos
 * @returns {String} Tiempo formateado
 */
function formatTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  if (days > 0) parts.push(`${days} día${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hora${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`);
  
  return parts.join(', ');
}

/**
 * Verifica si un usuario tiene permisos para un comando
 * @param {Object} member - Miembro del servidor
 * @param {Array} requiredPermissions - Permisos requeridos
 * @returns {Boolean} True si tiene permisos, false si no
 */
function checkPermissions(member, requiredPermissions) {
  // Los propietarios del bot siempre tienen permiso
  if (config.owners.includes(member.user.id)) return true;
  
  // Verificar permisos específicos
  if (requiredPermissions && requiredPermissions.length > 0) {
    return member.permissions.has(requiredPermissions);
  }
  
  return true;
}

/**
 * Obtiene la traducción según el idioma
 * @param {String} key - Clave de traducción
 * @param {String} language - Código de idioma
 * @param {Object} replacements - Valores a reemplazar
 * @returns {String} Texto traducido
 */
function translate(key, language = config.defaultLanguage, replacements = {}) {
  try {
    // Cargar archivo de idioma
    const langFile = require(`../languages/${language}.json`);
    
    // Obtener la traducción por la clave
    let text = key.split('.').reduce((obj, i) => obj[i], langFile);
    
    // Si no existe, intentar con el idioma predeterminado
    if (!text && language !== config.defaultLanguage) {
      const defaultLangFile = require(`../languages/${config.defaultLanguage}.json`);
      text = key.split('.').reduce((obj, i) => obj[i], defaultLangFile);
    }
    
    // Si aún no existe, devolver la clave
    if (!text) return key;
    
    // Reemplazar variables
    Object.keys(replacements).forEach(key => {
      text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
    });
    
    return text;
  } catch (error) {
    return key;
  }
}

module.exports = {
  createEmbed,
  createButtonRow,
  formatNumber,
  randomNumber,
  formatTime,
  checkPermissions,
  translate
};