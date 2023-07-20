import { createContext } from 'react';

const AppContext = createContext({
  isDark: false,
});

export const RegisterWizardContext = createContext({ user: {} });

export const ChatContext = createContext({});
export const ProfileContext = createContext({});
export const FeedDetailContext = createContext({});
export const NotificationContext = createContext({});
export const MainContext = createContext({});
export const SearchContext = createContext({});

export const AuthContext = createContext({
  isLoading: false,
  isAuthenticated: false,
  user: null,
  token: null
});

export default AppContext;
