"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useSearchParams } from "next/navigation";
import MessageBox from "./components/MessageBox";
import LoadingSpinner from "./components/LoadingSpinner";
import Ranking from "./components/Ranking"; // Importar o Ranking
import About from "./components/About";
import Regiment from "./components/Regiment";
import BackToTop from "./components/BackToTop";

const HomePage = () => {
  const params = useSearchParams();
  const { login, isLoading, user, isLoggingOut } = useAuth(); // Acessa o estado de loading e user
  const code = params.get("code");
  const [errorMessage, setErrorMessage] = useState(null);
  const isLoginProcessed = useRef(false); // Use a ref to track if login has been processed

  useEffect(() => {
    const handleLogin = async () => {
      if (code && !isLoginProcessed.current) {
        isLoginProcessed.current = true; // Mark as processed
        try {
          await login(code); // Realiza o login
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          if (error?.response?.data?.errors?.length) {
            setErrorMessage(error.response.data.errors.join(" "));
          } else {
            setErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
          }
        }
      }
    };

    handleLogin();
  }, [code, login]);

  // Verifica se está carregando ou se o usuário não está autenticado
  if (isLoading || isLoggingOut || (code && user === null)) {
    return <LoadingSpinner />; // Exibe o carregamento enquanto o estado de usuário não é obtido
  }

  return (
    <div className="bg-wheat pb-20 md:pb-28">
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-minor"
          onClose={() => setErrorMessage(null)}
        />
      )}

      <div className="p-4">
        <Ranking /> {/* Inserir o Ranking na HomePage */}
      </div>

      <About />

      <Regiment />

      <BackToTop />
    </div>
  );
};

export default HomePage;
