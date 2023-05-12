import { useState, useEffect } from 'react';

function useLocalStorageState(key: string, defaultValue: any) {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    setState(storedValue !== null ? JSON.parse(storedValue) : defaultValue);
  }, [key, defaultValue]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
