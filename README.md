# GloomBot - Bot de Discord Premium Multifuncional

GloomBot es un bot de Discord premium multifuncional con características avanzadas de moderación, economía, información y entretenimiento. Diseñado para mejorar la experiencia de tu servidor con comandos intuitivos y un sistema robusto.

## ✨ Características

- **Sistema de Moderación Avanzado**: Comandos para banear, expulsar, silenciar y limpiar mensajes
- **Economía Virtual**: Sistema completo con trabajo, tienda, inventario y más
- **Comandos de Información**: Detalles del servidor, usuarios y estadísticas
- **Entretenimiento**: Memes, juegos y otras actividades divertidas
- **Sistema de Logging**: Registro detallado de acciones y eventos
- **Soporte para Slash Commands**: Interfaz moderna con comandos slash

## 📋 Requisitos

- Node.js 16.9.0 o superior
- MongoDB (opcional, para funciones de economía y configuración persistente)
- Token de Bot de Discord
- Permisos adecuados en el servidor

## 🚀 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/gloombot.git
   cd gloombot
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con la siguiente información:
   ```
   TOKEN=tu_token_de_discord
   CLIENT_ID=id_de_tu_aplicacion
   GUILD_ID=id_de_tu_servidor_para_desarrollo
   MONGODB_URI=tu_uri_de_mongodb
   OPENAI_API_KEY=tu_clave_api_de_openai
   YOUTUBE_API_KEY=tu_clave_api_de_youtube
   ```

4. Configura el archivo `src/config/config.json` según tus preferencias

5. Registra los comandos slash:
   ```bash
   npm run deploy
   ```

6. Inicia el bot:
   ```bash
   npm start
   ```

## 📚 Comandos

### Moderación
- `/ban`: Banea a un usuario del servidor
- `/kick`: Expulsa a un usuario del servidor
- `/clear`: Elimina una cantidad específica de mensajes

### Información
- `/server-info`: Muestra información detallada del servidor
- `/user-info`: Muestra información de un usuario
- `/help`: Muestra la lista de comandos disponibles

### Economía
- `/balance`: Muestra tu balance actual
- `/work`: Trabaja para ganar monedas

### Diversión
- `/meme`: Muestra un meme aleatorio
- `/rps`: Juega a piedra, papel o tijeras
## 🛠️ Estructura del Proyecto

```
gloombot/
├── src/
│   ├── commands/         # Comandos organizados por categorías
│   │   ├── economy/
│   │   ├── fun/
│   │   ├── info/
│   │   └── moderation/
│   ├── config/           # Archivos de configuración
│   ├── database/         # Modelos y conexión a la base de datos
│   ├── events/           # Manejadores de eventos de Discord
│   ├── utils/            # Utilidades y funciones comunes
│   ├── deploy-commands.js # Script para registrar comandos slash
│   └── index.js          # Punto de entrada principal
├── .env                  # Variables de entorno
├── package.json
└── README.md
```

## 📝 Guía de Despliegue

Para desplegar el bot en un servidor, consulta nuestra [Guía de Despliegue en Render](./DEPLOYMENT_GUIDE.md).

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Distribuido bajo la licencia MIT. Consulta `LICENSE` para más información.

## 📞 Soporte

Si necesitas ayuda, únete a nuestro [servidor de Discord](https://discord.gg/tuservidordesoporte).

---

Hecho con ❤️ por [Tu Nombre](https://github.com/tu-usuario)
