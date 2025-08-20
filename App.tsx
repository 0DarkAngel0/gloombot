
import React, { useState, useEffect } from 'react';
import { Message } from './types';
import { handleCommand } from './services/commandHandler';
import ChatInterface from './components/ChatInterface';
import { BOT_AVATAR_URL, USER_AVATAR_URL, BOT_PREFIX } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Initial welcome message from the bot
    setMessages([
      {
        id: Date.now(),
        author: 'Bot',
        avatar: BOT_AVATAR_URL,
        content: (
          <div>
            <p className="font-bold text-lg">¡Bienvenido al Simulador de Bot de Discord!</p>
            <p>Escribe <span className="bg-gray-900 px-1.5 py-0.5 rounded font-mono text-sm">{BOT_PREFIX}help</span> para ver la lista de comandos disponibles.</p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  const onSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now(),
      author: 'Usuario',
      avatar: USER_AVATAR_URL,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);

    const botResponseContent = await handleCommand(text);
    
    if (botResponseContent) {
      const botMessage: Message = {
        id: Date.now() + 1,
        author: 'Bot',
        avatar: BOT_AVATAR_URL,
        content: botResponseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Add a slight delay for a more realistic feel
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
      }, 500);
    }
  };

  return (
    <div className="bg-gray-700 text-gray-200 h-screen w-screen flex flex-col antialiased">
      <header className="bg-gray-900 shadow-lg p-4 flex items-center z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
        <h1 className="text-xl font-semibold text-white">general</h1>
      </header>
      <ChatInterface messages={messages} onSendMessage={onSendMessage} />
    </div>
  );
};

export default App;