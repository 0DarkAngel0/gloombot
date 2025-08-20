const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Ruta principal para mantener el bot activo
app.get('/', (req, res) => {
  res.send('¡GloomBot está en línea! 🤖');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor web iniciado en el puerto ${port}`);
});

// Importar el bot
require('./src/index.js');