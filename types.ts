
import type React from 'react';

export interface Message {
  id: number;
  author: 'Usuario' | 'Bot';
  avatar: string;
  content: React.ReactNode;
  timestamp: string;
}