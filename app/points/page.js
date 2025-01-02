"use client";

import { useState, useEffect } from "react";
import Tab from "../components/Tab";
import MessageBox from "../components/MessageBox";
import NotAuthorized from "../components/NotAuthorized";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchPrivateData } from "../utils/api"; // Função de requisição
import { useAuth } from "../providers/AuthProvider";
import PontuacaoForm from "../components/PontuacaoForm"; // Importando o formulário

import { postPrivateData } from "../utils/api";
import { isFromCategory } from "../utils/role";

// Cores para cada senso
const SENSE_COLORS = {
  Limpeza: "#18a08c",
  Saúde: "#49c8aa",
  Utilização: "#ffbb03",
  Ordenação: "#ff941b",
  Autodisciplina: "#ff8486",
};

const PointsPage = () => {
  const [groupedRules, setGroupedRules] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, isLoading, getToken } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const token = getToken(); // Obtém o token do usuário logado.

  // Busca as regras permitidas para o usuário
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const data = await fetchPrivateData("regras/permitidas", token);

        // Agrupa as regras por senso
        const grouped = data.reduce((acc, rule) => {
          const senso = rule.senso?.descricao || "Sem Senso";
          if (!acc[senso]) acc[senso] = [];
          acc[senso].push(rule);
          return acc;
        }, {});
        console.log(grouped["Utilização"]);
        setGroupedRules(grouped);

        // Define a aba ativa como a primeira
        if (Object.keys(grouped).length > 0) {
          setActiveTab(Object.keys(grouped)[0]);
        }
      } catch (error) {
        setErrorMessage("Erro ao carregar regras: " + error.message);
      }
    };
    fetchRules();
  }, [token]);

  useEffect(() => {
    // Aguarda o carregamento do usuário
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (Object.keys(groupedRules).length > 0) {
      setActiveTab(Object.keys(groupedRules)[0]);
    }
  }, [groupedRules]);

  // Enquanto estiver carregando, exibe o LoadingSpinner
  if (!isReady) return <LoadingSpinner />;

  if (user === null) return <NotAuthorized />;

  if (
    user === null ||
    (!isFromCategory(user, "Admin") && !isFromCategory(user, "Aval"))
  )
    return <NotAuthorized />;

    const handleSubmit = async (formData) => {      
  
      // Verificar se o token está presente
      if (!token) {
        setErrorMessage("Token de autenticação não encontrado");
        return;
      }
  
      // Criar um objeto com os dados de formData que serão enviados
      const dataToSend = {
        id_turma: formData.idTurma,
        id_regra: formData.idRegra,
        pontos: formData.pontos,
        motivacao: formData.motivacao,
        matriculaAluno: formData.matriculaAluno,
        bimestre: formData.bimestre,
        turno: formData.turno,
      };
  
      // Chamar o método para enviar os dados
      try {
        const response = await postPrivateData(
          "pontuacao/lancar", // Endpoint onde a pontuação será lançada
          dataToSend, // Dados do formulário
          token // Token de autenticação
        );
        console.log(response);
        setSuccessMessage("Pontuação lançada com sucesso");
      } catch (error) {
        setErrorMessage("Erro ao enviar pontuação: " + error);
      }
    };

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-subtle"
          onClose={() => setErrorMessage(null)}
        />
      )}

      {successMessage && (
        <MessageBox
          message={errorMessage}
          color="green"
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Lançar Pontuação</h1>

      <div className="overflow-x-auto flex flex-nowrap gap-2 border-b border-gray-300 mb-4">
        <Tab
          tabs={Object.keys(groupedRules)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabColors={SENSE_COLORS}
        />
      </div>

      {activeTab && (
        <div
          className="p-4 border rounded-md mt-4"
          style={{ borderColor: SENSE_COLORS[activeTab] || "#ccc" }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: SENSE_COLORS[activeTab] }}
          >
            {activeTab}
          </h2>
          <PontuacaoForm
            onSubmit={handleSubmit}
            key={activeTab} // Força re-renderização ao mudar de aba
            regrasDisponiveis={groupedRules[activeTab]}
          />
        </div>
      )}
    </div>
  );
};

export default PointsPage;
