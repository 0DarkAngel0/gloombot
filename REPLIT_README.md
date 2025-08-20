# GloomBot - Configuración en Replit

Este documento explica cómo configurar y ejecutar GloomBot en la plataforma Replit.

## Configuración Inicial

1. **Importa el repositorio a Replit**
   - Crea una nueva Repl en Replit
   - Selecciona "Import from GitHub"
   - Pega la URL de tu repositorio

2. **Configura las variables de entorno**
   - En el panel izquierdo, haz clic en el icono de candado (Secrets)
   - Añade las siguientes variables:
     - `TOKEN`: El token de tu bot de Discord
     - `CLIENT_ID`: El ID de cliente de tu aplicación de Discord
     - `GUILD_ID`: (Opcional) El ID de tu servidor para pruebas
     - `MONGODB_URI`: (Opcional) URI de conexión a MongoDB si usas base de datos

3. **Instala las dependencias**
   - Replit debería instalar automáticamente las dependencias al iniciar
   - Si no lo hace, ejecuta `npm install` en la consola

## Ejecución del Bot

1. **Inicia el bot**
   - Haz clic en el botón "Run" en la parte superior
   - El bot debería iniciar y mostrar un mensaje de confirmación en la consola
   - El servidor web integrado mantendrá el bot activo

2. **Verifica que el bot esté en línea**
   - Comprueba que el bot aparezca como en línea en tu servidor de Discord
   - Prueba algunos comandos slash para verificar su funcionamiento

## Mantener el Bot Activo 24/7

1. **Configura UptimeRobot**
   - Crea una cuenta en [UptimeRobot](https://uptimerobot.com/)
   - Añade un nuevo monitor de tipo HTTP(s)
   - Usa la URL de tu Repl (aparece en la ventana del navegador web integrado)
   - Configura el intervalo de monitoreo a 5 minutos

2. **Habilita "Always On"** (si tienes Replit Hacker Plan)
   - En la pestaña "Tools" de tu Repl
   - Activa la opción "Always On"

## Solución de Problemas

- **El bot se desconecta**: Verifica que UptimeRobot esté configurado correctamente
- **Errores de dependencias**: Ejecuta `npm install` manualmente
- **Comandos slash no funcionan**: Ejecuta `npm run deploy` para registrarlos nuevamente

## Recursos Adicionales

- [Documentación de Discord.js](https://discord.js.org/)
- [Documentación de Replit](https://docs.replit.com/)
- [Guía de UptimeRobot](https://uptimerobot.com/help/)