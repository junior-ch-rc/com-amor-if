"use client";

import { useState, useEffect } from "react";
import MessageBox from "../components/MessageBox";
import { useAuth } from "../providers/AuthProvider";
import NotAuthorized from "../components/NotAuthorized";
import hasRole from "../utils/hasRole";
import LoadingSpinner from "../components/LoadingSpinner"; // Importe o LoadingSpinner

const Years = () => {
  const [errorMessage, setErrorMessage] = useState(null); // Armazena o erro para exibir
  const { user, isLoading } = useAuth(); // Supondo que você tem um estado isLoading
  const [isReady, setIsReady] = useState(false); // Controla quando o componente deve ser renderizado

  // Usa o useEffect para monitorar o estado de carregamento
  useEffect(() => {
    // Aguarda o carregamento do usuário
    if (!isLoading) {
      setIsReady(true); // Quando o carregamento for concluído, marca como pronto para renderizar
    }
  }, [isLoading]); // Só vai rodar quando o isLoading mudar

  // Enquanto estiver carregando, exibe o LoadingSpinner
  if (!isReady) {
    return <LoadingSpinner />;
  }

  // Se não tiver o usuário ou o usuário não tem a role adequada, exibe a página de não autorizado
  if (user === null || !hasRole(user, "ADMINISTRADOR")) {
    return <NotAuthorized />;
  }

  return (
    <>
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-subtle"
          onClose={() => setErrorMessage(null)}
        />
      )}
      {/* Renderize o conteúdo aqui */}
    </>
  );
};

export default Years;
