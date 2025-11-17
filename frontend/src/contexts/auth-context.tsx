"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  logOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          apiClient.setToken(token);
          const response = await apiClient.getCurrentUser();
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        apiClient.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.register(email, password, name);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logOut = () => {
    apiClient.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
