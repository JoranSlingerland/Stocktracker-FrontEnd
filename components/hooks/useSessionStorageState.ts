import { useState, useEffect } from 'react';

export default function useSessionStorageState(key: string, defaultValue: any) {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    const storedValue = sessionStorage.getItem(key);
    setState(storedValue !== null ? JSON.parse(storedValue) : defaultValue);
  }, [key, defaultValue]);

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
