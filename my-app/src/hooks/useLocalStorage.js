import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.error('Ошибка чтения localStorage:', err);
      return initialValue;
    }
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Сохранено в localStorage: ${key}`);
      } catch (err) {
        console.error('Ошибка записи в localStorage:', err);
      }
    }, 500);

    return () => clearTimeout(timerRef.current);
  }, [key, value]);

  return [value, setValue];
}