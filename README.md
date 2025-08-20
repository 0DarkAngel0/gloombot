# Discord Bot con Gemini API

Este es un bot de Discord multifuncional construido con [Discord.js](https://discord.js.org/) y potenciado por la API de Google Gemini.

## Características

-   **Comandos Slash Modernos**: Interfaz de usuario limpia e intuitiva.
-   **Integración con Gemini**: Comando `/8ball` para respuestas divertidas de la IA.
-   **Comandos de Utilidad**: `/ping`, `/user-info`, `/server-info`.
-   **Comandos de Interacción**: `/poll` para crear encuestas.
-   **Ayuda Dinámica**: El comando `/help` siempre está actualizado.
-   **Listo para Producción**: Escrito en TypeScript, con scripts para compilar y ejecutar.

## Prerrequisitos

-   [Node.js](https://nodejs.org/) v16.9.0 o superior.
-   Una cuenta de Discord y conocimientos básicos del [Portal de Desarrolladores de Discord](https://discord.com/developers/applications).
-   Una [Clave de API de Google Gemini](https://aistudio.google.com/app/apikey).

## Configuración

1.  **Clonar el repositorio**
    ```bash
    git clone <url-del-repositorio>
    cd discord-gemini-bot
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar las variables de entorno**
    -   Copia el archivo `.env.example` a un nuevo archivo llamado `.env`.
    -   Abre el archivo `.env` y rellena las variables:
        -   `DISCORD_TOKEN`: El token de tu bot del Portal de Desarrolladores de Discord.
        -   `API_KEY`: Tu clave de API de Google Gemini.
        -   `CLIENT_ID`: El ID de cliente/aplicación de tu bot.
        -   `GUILD_ID`: (Opcional) El ID de tu servidor de Discord. Proporcionar esto permite que los comandos se actualicen instantáneamente en ese servidor para pruebas.

4.  **Registrar los Comandos Slash**
    Antes de iniciar el bot por primera vez, necesitas registrar sus comandos con Discord.
    ```bash
    npm run deploy
    ```
    Este comando solo necesita ser ejecutado de nuevo si cambias, añades o eliminas comandos.

5.  **Iniciar el Bot**
    -   Para desarrollo (con recarga en caliente usando `ts-node`):
        ```bash
        npm run dev
        ```
    -   Para producción:
        ```bash
        # Primero, compila el código TypeScript a JavaScript
        npm run build

        # Luego, inicia el bot desde los archivos compilados
        npm start
        ```

¡Y eso es todo! Tu bot debería estar en línea en tu servidor.
