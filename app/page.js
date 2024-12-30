"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useSearchParams } from "next/navigation";
import Header from "./components/Header";
import MessageBox from "./components/MessageBox";
import LoadingSpinner from "./components/LoadingSpinner";
import Ranking from "./components/Ranking"; // Importar o Ranking
import About from "./components/About";
import Regiment from "./components/Regiment";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

const HomePage = () => {
  const params = useSearchParams();
  const { user, getCurrentUser, login } = useAuth();
  const code = params.get("code");
  const [isLoginProcessed, setIsLoginProcessed] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Armazena o erro para exibir

  useEffect(() => {
    const handleLogin = async () => {
      if (code && !isLoginProcessed) {
        setIsLoggingIn(true);
        try {
          await login(code);
          setIsLoginProcessed(true);
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          if (error?.response?.data?.errors?.length) {
            setErrorMessage(error.response.data.errors.join(" "));
          } else {
            setErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
          }
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    handleLogin();
  }, [code, login, isLoginProcessed]);

  useEffect(() => {
    const initializeUser = async () => {
      if (!user?.username) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error("Erro ao obter o usuário atual:", error);
        }
      }
    };

    initializeUser();
  }, [user, getCurrentUser]);

  return (
    <>
      {isLoggingIn && <LoadingSpinner />}
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-subtle"
          onClose={() => setErrorMessage(null)}
        />
      )}
      <Header isLoggedIn={!!user?.username} username={user?.username || ""} />

      <main className="p-4">
        <Ranking /> {/* Inserir o Ranking na HomePage */}
      </main>

      <About />

      <Regiment />

      <Footer />

      <BackToTop />
    </>
  );
};

export default HomePage;
