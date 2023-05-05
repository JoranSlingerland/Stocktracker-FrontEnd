import { useState, useEffect } from 'react';

function useLocalStorageState(
  key: string,
  defaultValue: any,
  overWrite: boolean = false
) {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    if (typeof window !== 'undefined' && !overWrite) {
      const storedValue = localStorage.getItem(key);
      setState(storedValue !== null ? JSON.parse(storedValue) : defaultValue);
    }
    if (overWrite) {
      setState(defaultValue);
    }
  }, [key, defaultValue, overWrite]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorageState;
