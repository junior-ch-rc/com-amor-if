"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./providers/AuthProvider";
import { useSearchParams } from "next/navigation";
import MessageBox from "./components/MessageBox";
import LoadingSpinner from "./components/LoadingSpinner";
import Ranking from "./components/Ranking"; // Importar o Ranking
import About from "./components/About";
import Regiment from "./components/Regiment";
import BackToTop from "./components/BackToTop";

const HomePage = () => {
  const params = useSearchParams();
  const { login, isLoading } = useAuth(); // Acessa o estado de loading e user
  const code = params.get("code");
  const [isLoginProcessed, setIsLoginProcessed] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const handleLogin = async () => {
      if (code && !isLoginProcessed) {
        setIsLoginProcessed(true); // Marca como processado para evitar múltiplas tentativas de login
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
  }, [code, isLoginProcessed, login]);

  // Verifica se está carregando ou se o usuário não está autenticado
  if (isLoading) {
    return <LoadingSpinner />; // Exibe o carregamento enquanto o estado de usuário não é obtido
  }

  return (
    <div className="bg-wheat pb-20 md:pb-28">
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-subtle"
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
