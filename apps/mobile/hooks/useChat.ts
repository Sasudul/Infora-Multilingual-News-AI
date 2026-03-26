import { useState } from 'react';
import { sendMessage } from '../app/services/api';

export function useChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    const res = await sendMessage(text);

    const botMsg = { role: 'assistant', content: res.reply };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return { messages, send, loading };
}