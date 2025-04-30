"use client";

import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import MessageBox from "./MessageBox";

const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL; // Ajuste conforme sua variável de ambiente

const Ranking = () => {
  const [turmas, setTurmas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getTurmasPontuacao = async (url) => {
    setIsLoading(true);
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      // Ordena as turmas pela pontuação em ordem decrescente
      const sortedTurmas = data.sort((a, b) => b.pontuacao - a.pontuacao);
      setTurmas(sortedTurmas);
    } catch (error) {
      setErrorMessage(
        "Erro ao buscar turmas: " + error.response.data.errors[0]
      );
      setErrorMessage(
        "Erro ao carregar o ranking. Por favor, tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const pointsURL = `${apiUrl}public/pontuacao`; // Certifique-se que a URL está correta
    getTurmasPontuacao(pointsURL);
  }, []);

  return (
    <div
      id="ranking"
      className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-md mt-6 p-2 md:p-6"
    >
      <h2 className="text-2xl font-bold text-center mt-4 md:mt-0 mb-6 text-primary">
        Ranking de Turmas
      </h2>

      {isLoading && <LoadingSpinner />}

      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-minor"
          onClose={() => setErrorMessage(null)}
        />
      )}

      {!isLoading && !errorMessage && (
        <ul className="space-y-4">
          {turmas.map((turma, index) => {
            const isFirstPlace =
              index === 0 &&
              turma.pontuacao > 0 &&
              (turmas.length === 1 || turma.pontuacao !== turmas[1]?.pontuacao);

            return (
              <li
                key={turma.id}
                className={`rounded-md p-4 ${
                  isFirstPlace
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {/* Linha 1: Ícone + Nome */}
                <div className="flex items-center gap-2 mb-1">
                  {isFirstPlace && (
                    <FaCrown className="text-yellow-400 text-xl" />
                  )}
                  <span className="text-lg font-semibold">
                    {turma.descricao}
                  </span>
                </div>

                {/* Linha 2: Descrição + Pontuação */}
                <div className="flex items-center justify-between text-sm md:text-base">
                  <span
                    className={isFirstPlace ? "text-white" : "text-gray-500"}
                  >
                    {turma.nome}
                  </span>
                  <span className="font-bold">
                    {turma.pontuacao.toLocaleString()} pts
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Ranking;
