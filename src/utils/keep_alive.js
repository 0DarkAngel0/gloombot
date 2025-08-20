const express = require('express');
const logger = require('./logger');

function keepAlive() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.get('/', (req, res) => {
    res.send('¡GloomBot está en línea! 🤖');
  });

  app.listen(port, () => {
    logger.info(`Servidor web iniciado en el puerto ${port}`);
  });
}

module.exports = keepAlive;