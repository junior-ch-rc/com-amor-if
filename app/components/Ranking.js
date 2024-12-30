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
      console.error("Erro ao buscar turmas:", error.message);
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
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Ranking de Turmas
      </h2>

      {isLoading && <LoadingSpinner />}

      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-subtle"
          onClose={() => setErrorMessage(null)}
        />
      )}

      {!isLoading && !errorMessage && (
        <ul className="space-y-4">
          {turmas.map((turma, index) => (
            <li
              key={turma.id}
              className={`flex items-center justify-between p-4 rounded-md ${
                index === 0
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex items-center">
                {index === 0 && (
                  <FaCrown className="text-yellow-400 text-2xl mr-3" />
                )}
                <span className="text-lg font-semibold mr-2">{turma.nome}</span>
                <span
                  className={`text-sm ${
                    index === 0 ? "text-white" : "text-gray-500"
                  }`}
                >
                  ({turma.descricao})
                </span>
              </div>
              <div className="text-lg font-bold">{turma.pontuacao} pts</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ranking;