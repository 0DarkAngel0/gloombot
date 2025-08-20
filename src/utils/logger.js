// Sistema de logging avanzado
const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, align } = format;

// Asegurar que el directorio de logs existe
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Formato personalizado para los logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Crear el logger con múltiples transportes
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [
    // Consola con colores
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        align(),
        logFormat
      )
    }),
    // Archivo para todos los logs
    new transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    // Archivo separado solo para errores
    new transports.File({ 
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  ],
  // No finalizar en caso de error
  exitOnError: false
});

// Función para loggear a un canal de Discord si está disponible
logger.logToChannel = async (client, level, message) => {
  try {
    // Solo intentar enviar a Discord si el cliente está listo
    if (!client || !client.isReady()) return;
    
    // Obtener el canal de logs según el nivel
    const channelName = client.config.logChannels[level] || client.config.logChannels.error;
    const guild = client.guilds.cache.first();
    
    if (!guild) return;
    
    const channel = guild.channels.cache.find(ch => ch.name === channelName);
    
    if (channel) {
      await channel.send({
        embeds: [{
          color: level === 'error' ? 0xFF0000 : level === 'warn' ? 0xFFAA00 : 0x00AAFF,
          title: `${level.toUpperCase()} | Log`,
          description: `\`\`\`\n${message}\n\`\`\``,
          timestamp: new Date()
        }]
      });
    }
  } catch (err) {
    // No usar logger aquí para evitar recursión
    console.error(`Error al enviar log a Discord: ${err}`);
  }
};

// Extender los métodos del logger para incluir logging a Discord
const originalError = logger.error;
logger.error = function(message, client) {
  originalError.call(this, message);
  if (client) this.logToChannel(client, 'error', message);
};

const originalWarn = logger.warn;
logger.warn = function(message, client) {
  originalWarn.call(this, message);
  if (client) this.logToChannel(client, 'warn', message);
};

const originalInfo = logger.info;
logger.info = function(message, client) {
  originalInfo.call(this, message);
  if (client) this.logToChannel(client, 'info', message);
};

module.exports = logger;