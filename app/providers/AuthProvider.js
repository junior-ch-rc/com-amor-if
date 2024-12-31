"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

const API_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const redirectPath = "/";

  const [cookies, setCookie, removeCookie] = useCookies([
    "access_token",
    "refresh_token",
    "roles",
  ]);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para controle de carregamento

  // Função para obter usuário atual
  const getCurrentUser = async () => {
    if (cookies.access_token) {
      const header = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.access_token,
      };
      const url = `${API_URL}auth/user`;

      try {
        const response = await axios.get(url, { headers: header });
        setUser({
          username: response.data.nome,
          roles: [...response.data.roles],
        });
      } catch (error) {
        logout();
        console.log("Erro GetCurrentUser: ", error);
      } finally {
        setIsLoading(false); // Garantir que o loading seja finalizado
      }
    } else {
      setIsLoading(false); // Se não tiver token, marcar como carregado
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      // Só chama getCurrentUser se o usuário ainda não estiver carregado
      if (!user?.username && cookies.access_token) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.log("Erro ao obter o usuário atual:", error);
        }
      } else {
        setIsLoading(false); // Marca como carregado mesmo sem token
      }
    };

    initializeUser();
  }, [cookies.access_token, user?.username]); // Chama quando o token ou usuário mudam

  // Função de login
  const login = async (code) => {
    const url = `${API_URL}auth/register?code=${code}`;

    await axios.get(url).then((response) => {
      if (response.data.access_token) {
        setCookie("access_token", response.data.access_token, { path: "/" });
        setCookie("refresh_token", response.data.refresh_token, { path: "/" });
        setCookie("roles", response.data.roles, { path: "/" });

        setUser({
          username: response.data.nome,
          roles: [...response.data.roles],
        });
      }
      router.push(redirectPath);
    });
  };

  // Função de logout
  const logout = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("roles");
    setUser(null);
  };

  // Função para obter o token
  const getToken = () => {
    return cookies.access_token;
  };

  return (
    <AuthContext.Provider
      value={{ user, getToken, login, logout, getCurrentUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
