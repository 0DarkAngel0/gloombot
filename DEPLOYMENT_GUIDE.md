# Guía de Despliegue en Render para GloomBot

Esta guía te ayudará a desplegar tu bot de Discord en [Render](https://render.com/), un servicio de hosting en la nube que ofrece un plan gratuito adecuado para bots de Discord.

## Requisitos Previos

1. Una cuenta en [Render](https://render.com/)
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

¡Felicidades! Tu bot de Discord ahora debería estar funcionando en Render. Si encuentras algún problema, consulta la [documentación oficial de Render](https://render.com/docs) o la [documentación de Discord.js](https://discord.js.org/).