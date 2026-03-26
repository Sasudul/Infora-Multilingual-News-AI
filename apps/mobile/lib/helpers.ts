import { newsApi, chatApi } from './api';

// Fetch news
export const fetchNews = async () => {
  try {
    const data = await newsApi.getLatest(30);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
};

// Send chat message
export const sendMessage = async (message: string, sessionId?: string, language = 'en') => {
  try {
    const response = await chatApi.sendMessage(message, sessionId, language);
    return response;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};
