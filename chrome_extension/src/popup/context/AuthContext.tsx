import { useContext, createContext, useState, FC, useEffect } from "react";

import { User } from "../interfaces/User";
import { getSession } from "../services/apiService";

const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (user: boolean) => void;
}>({
  user: null,
  setUser: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

interface AuthContextProps {
  children: React.ReactNode;
}

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a AuthProvider");
  }

  return context;
};

const AuthProvider: FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cookie = await chrome.runtime.sendMessage({ type: "getCookie" });

      const session = await getSession();
      setUser(session as User);

      setIsLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
