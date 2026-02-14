'use client';

import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type AppContextType = {
  token: string | null;
  setToken: Function;
  isSignedIn: boolean;
  setIsSignedIn: Function;
  isLoading: boolean;
  user: string | null;
};

const AppContext = createContext<AppContextType | null>(null);

//CONTEXT HOOK
export const useAppContext = () => {
  const { token, setToken, isSignedIn, setIsSignedIn, isLoading, user } =
    useContext<any>(AppContext);

  return { token, setToken, isSignedIn, setIsSignedIn, isLoading, user };
};

//PROVIDER COMPONENT
const AppProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const storedValue = localStorage.getItem('ninja-token');
    const storedUser = localStorage.getItem('ninja-user');

    if (!storedValue || !storedUser) {
      console.warn('User not logged in');
      setToken(null);
      setIsSignedIn(false);
      setIsLoading(false);
      return;
    }

    setUser(storedUser);
    setToken(storedValue);
    setIsSignedIn(true);
    setIsLoading(false);
    console.log('App context hydrated');
  }, []);

  return (
    <AppContext.Provider
      value={{ token, setToken, isSignedIn, setIsSignedIn, isLoading, user }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
