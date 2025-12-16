const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Chemin du dossier de logs local
const logDir = path.join(__dirname, '../../logs');

// Si on est en local, créer le dossier logs
if (process.env.NODE_ENV !== 'production') {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}

// Créer le logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Toujours loguer dans la console (Vercel et local)
    new winston.transports.Console(),

    // Log vers fichier uniquement en développement local
    ...(process.env.NODE_ENV !== 'production'
      ? [new winston.transports.File({ filename: path.join(logDir, 'combined.log') })]
      : [])
  ],
});

module.exports = logger;
