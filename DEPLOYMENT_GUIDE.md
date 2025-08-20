# Guía de Despliegue para GloomBot

Esta guía te ayudará a desplegar tu bot de Discord en diferentes plataformas de hosting en la nube que ofrecen planes gratuitos adecuados para bots de Discord.

## Requisitos Previos

1. Una cuenta en [Render](https://render.com/) o [Replit](https://replit.com/)
2. Una cuenta en [GitHub](https://github.com/) (opcional, pero recomendado)
3. Tu bot de Discord completamente configurado y funcionando localmente

## Paso 1: Preparar tu Proyecto

### Crear archivo `package.json`

Asegúrate de que tu archivo `package.json` contenga las dependencias necesarias y los scripts de inicio:

```json
{
  "name": "gloombot",
  "version": "1.0.0",
  "description": "Bot de Discord Premium Multifuncional",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "deploy": "node src/deploy-commands.js"
  },
  "dependencies": {
    "discord.js": "^14.11.0",
    "dotenv": "^16.0.3",
    "mongoose": "^7.2.1",
    "node-fetch": "^2.6.11",
    "winston": "^3.8.2",
    "winston-daily-rotate-file": "^4.7.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  },
  "engines": {
    "node": ">=16.9.0"
  }
}
```

### Crear archivo `.gitignore`

Si aún no lo tienes, crea un archivo `.gitignore` para evitar subir archivos sensibles o innecesarios:

```
node_modules/
.env
.env.local
.DS_Store
logs/
*.log
npm-debug.log*
```

## Paso 2: Subir tu Proyecto a GitHub (Opcional pero Recomendado)

1. Crea un nuevo repositorio en GitHub
2. Inicializa Git en tu proyecto local (si aún no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Versión inicial del bot"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

## Paso 3: Configurar el Servicio en Render

1. Inicia sesión en [Render](https://render.com/)
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub o sube tu código directamente
4. Configura el servicio con los siguientes parámetros:
   - **Name**: `gloombot` (o el nombre que prefieras)
   - **Environment**: `Node`
   - **Region**: Selecciona la región más cercana a tus usuarios
   - **Branch**: `main` (o la rama que estés utilizando)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

## Paso 4: Configurar Variables de Entorno

1. En la sección "Environment" de tu servicio en Render, añade las siguientes variables:
   - `TOKEN`: El token de tu bot de Discord
   - `CLIENT_ID`: El ID de cliente de tu aplicación de Discord
   - `GUILD_ID`: El ID de tu servidor de Discord (opcional, solo para desarrollo)
   - `MONGODB_URI`: La URI de conexión a tu base de datos MongoDB (si utilizas MongoDB)
   - `OPENAI_API_KEY`: Tu clave API de OpenAI (si utilizas funciones de IA)
   - `YOUTUBE_API_KEY`: Tu clave API de YouTube (si utilizas funciones relacionadas con YouTube)

## Paso 5: Desplegar los Comandos Slash

Antes de que tu bot funcione correctamente, necesitas registrar los comandos slash en la API de Discord:

1. Añade un "One-off Job" en Render:
   - **Name**: `deploy-commands`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run deploy`

2. Ejecuta este trabajo cada vez que actualices o añadas nuevos comandos slash

## Paso 6: Monitorear tu Bot

1. Una vez desplegado, Render proporcionará un panel donde podrás ver los logs de tu bot
2. Configura alertas para ser notificado si tu servicio se cae
3. Revisa periódicamente el uso de recursos para asegurarte de que estás dentro de los límites del plan gratuito

## Consejos Adicionales

### Mantener tu Bot Activo (Evitar el Sueño en Plan Gratuito)

Los servicios gratuitos de Render se "duermen" después de 15 minutos de inactividad. Para mantener tu bot activo:

1. Configura un servicio de ping como [UptimeRobot](https://uptimerobot.com/) para hacer ping a tu servicio cada 5-10 minutos
2. Alternativamente, implementa un sistema de auto-ping en tu código:

```javascript
// En src/index.js, añade esto después de inicializar tu cliente
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot está activo!');
});
server.listen(process.env.PORT || 3000);
```

### Optimización de Recursos

- Utiliza caché cuando sea posible para reducir las llamadas a la API
- Implementa un sistema de sharding si tu bot crece a más de 2000 servidores
- Monitorea el uso de memoria y optimiza tu código si notas un consumo excesivo

### Actualizaciones y Mantenimiento

- Configura la integración continua para desplegar automáticamente cuando haces push a tu repositorio
- Mantén tus dependencias actualizadas regularmente
- Haz copias de seguridad de tu base de datos periódicamente

## Solución de Problemas Comunes

### El Bot No Se Conecta

- Verifica que el token sea correcto y esté correctamente configurado en las variables de entorno
- Asegúrate de que los intents necesarios estén habilitados en el portal de desarrolladores de Discord

### Comandos Slash No Aparecen

- Ejecuta nuevamente el script de despliegue de comandos
- Verifica que el CLIENT_ID sea correcto
- Asegúrate de que tu bot tenga los permisos necesarios en el servidor

### Errores de Memoria

- Considera implementar un sistema de sharding
- Optimiza las colecciones y cachés que mantienes en memoria
- Monitorea los logs para identificar fugas de memoria

---

## Despliegue en Replit

Replit es otra excelente opción para alojar tu bot de Discord, especialmente para proyectos más pequeños o en desarrollo.

### Paso 1: Preparar tu Proyecto para Replit

#### Crear archivos de configuración para Replit

Crea un archivo `replit.nix` en la raíz de tu proyecto:

```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.yarn
  ];
}
```

Crea un archivo `.replit` en la raíz de tu proyecto:

```
run = "npm start"
entrypoint = "src/index.js"
hidden = ["node_modules", ".config"]

[nix]
channel = "stable-22_11"

[env]
PATH = "/home/runner/$REPL_SLUG/.config/npm/node_global/bin:/home/runner/$REPL_SLUG/node_modules/.bin"
NPM_CONFIG_PREFIX = "/home/runner/$REPL_SLUG/.config/npm/node_global"

[packager]
language = "nodejs"

  [packager.features]
packageSearch = true
guessImports = true
enabledForHosting = false

[languages]

[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx}"

  [languages.javascript.languageServer]
start = "typescript-language-server --stdio"

[deployment]
run = ["sh", "-c", "npm start"]
deploymentTarget = "cloudrun"
```

#### Crear un módulo para mantener el bot activo

Crea un archivo `keep_alive.js` en la carpeta `src/utils/`:

```javascript
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
```

#### Actualizar el archivo index.js

Modifica tu archivo `src/index.js` para incluir el módulo keep_alive:

```javascript
// Importar módulo keep_alive para Replit
const keepAlive = require('./utils/keep_alive');

// En la función de inicialización
const init = async () => {
  try {
    // Iniciar servidor web para mantener el bot activo en Replit
    keepAlive();
    
    // Resto del código de inicialización...
  }
};
```

### Paso 2: Subir tu Proyecto a Replit

1. Inicia sesión en [Replit](https://replit.com/)
2. Haz clic en "+ Create Repl"
3. Selecciona "Import from GitHub"
4. Pega la URL de tu repositorio de GitHub
5. Haz clic en "Import from GitHub"

Si no estás usando GitHub, puedes crear un nuevo Repl con Node.js y subir tus archivos manualmente.

### Paso 3: Configurar Variables de Entorno

1. En el panel izquierdo, haz clic en el icono de candado (Secrets)
2. Añade las siguientes variables:
   - `TOKEN`: El token de tu bot de Discord
   - `CLIENT_ID`: El ID de cliente de tu aplicación de Discord
   - `GUILD_ID`: (Opcional) El ID de tu servidor para pruebas
   - `MONGODB_URI`: (Opcional) URI de conexión a MongoDB si usas base de datos

### Paso 4: Ejecutar el Bot

1. Haz clic en el botón "Run" en la parte superior
2. El bot debería iniciar y mostrar un mensaje de confirmación en la consola
3. El servidor web integrado mantendrá el bot activo

### Paso 5: Mantener el Bot Activo 24/7

1. **Configura UptimeRobot**
   - Crea una cuenta en [UptimeRobot](https://uptimerobot.com/)
   - Añade un nuevo monitor de tipo HTTP(s)
   - Usa la URL de tu Repl (aparece en la ventana del navegador web integrado)
   - Configura el intervalo de monitoreo a 5 minutos

2. **Habilita "Always On"** (si tienes Replit Hacker Plan)
   - En la pestaña "Tools" de tu Repl
   - Activa la opción "Always On"

### Solución de Problemas en Replit

#### El Bot se Desconecta Frecuentemente

- Verifica que UptimeRobot esté configurado correctamente
- Asegúrate de que el módulo keep_alive esté funcionando
- Considera actualizar a Replit Hacker Plan para usar "Always On"

#### Errores de Dependencias

- Ejecuta `npm install` manualmente en la consola
- Verifica que estés usando Node.js v16 o superior

#### Límites de Recursos

- Replit tiene límites de recursos en el plan gratuito
- Optimiza tu código para usar menos memoria
- Evita almacenar grandes cantidades de datos en memoria

---

¡Felicidades! Tu bot de Discord ahora debería estar funcionando en Render o Replit. Si encuentras algún problema, consulta la documentación oficial de [Render](https://render.com/docs), [Replit](https://docs.replit.com/) o [Discord.js](https://discord.js.org/).