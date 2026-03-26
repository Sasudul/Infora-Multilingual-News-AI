import { useState, useEffect } from 'react';
import { fetchNews } from '../app/services/api';

export function useNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews().then(setNews);
  }, []);

  return news;
}