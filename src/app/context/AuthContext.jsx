"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext(undefined);

const AuthContextProvider = ({ children }) => {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
    } else {
      const storedLogin = localStorage.getItem('isLoggedIn');
      if (storedLogin) {
        setIsLoggedIn(storedLogin === 'true');
      } else {
        setIsLoggedIn(false);
      }
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

  const login = async (identifier, password) => {
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setIsLoggedIn(true);
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', "false");
  };

  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn, 
      user: session?.user, 
      login,
      logout,
      loginWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
