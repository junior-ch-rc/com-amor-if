"use client";

import { useState, useEffect } from "react";
import Tab from "../components/Tab";
import Table from "../components/Table";
import MessageBox from "../components/MessageBox";
import NotAuthorized from "../components/NotAuthorized";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchPrivateData } from "../utils/api"; // Função de requisição
import { useAuth } from "../providers/AuthProvider";

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
  const [rules, setRules] = useState([]);
  const [groupedRules, setGroupedRules] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { user, isLoading, getToken } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [page, setPage] = useState(1); // Página atual
  const [itemsPerPage, setItemsPerPage] = useState(10); // Número de itens por página
  const token = getToken(); // Obtém o token do usuário logado.

  // Busca as regras permitidas para o usuário
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const data = await fetchPrivateData("regras/permitidas", token);
        setRules(data);

        // Agrupa as regras por senso
        const grouped = data.reduce((acc, rule) => {
          const senso = rule.senso?.descricao || "Sem Senso";
          if (!acc[senso]) acc[senso] = [];
          acc[senso].push(rule);
          return acc;
        }, {});

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
    // Atualiza o total de páginas toda vez que o activeTab mudar
    if (activeTab && groupedRules[activeTab]) {
      const totalPages = Math.ceil(
        groupedRules[activeTab].length / itemsPerPage
      );
      setPage(1); // Reseta para a primeira página quando mudar a aba
      setTotalPages(totalPages);
    }
  }, [activeTab, groupedRules, itemsPerPage]);

  const [totalPages, setTotalPages] = useState(1); // Total de páginas baseado na aba selecionada

  useEffect(() => {
    // Aguarda o carregamento do usuário
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  // Enquanto estiver carregando, exibe o LoadingSpinner
  if (!isReady) return <LoadingSpinner />;

  if (user === null) return <NotAuthorized />;

  if (
    user === null ||
    (!isFromCategory(user, "Admin") && !isFromCategory(user, "Aval"))
  )
    return <NotAuthorized />;

  // Função para mudar a página
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // Filtra as regras da página atual
  const getPaginatedData = () => {
    if (!activeTab || !groupedRules[activeTab]) return [];
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return groupedRules[activeTab]?.slice(startIndex, endIndex) || [];
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
          <div className="overflow-x-auto">
            <Table
              headers={[
                "Descricao",
                "Operacao",
                "Valor Minimo",
                "Valor Maximo",
              ]}
              data={getPaginatedData().map((rule) => ({
                descricao: rule.descricao,
                operacao: rule.operacao,
                valor_minimo: rule.valorMinimo, // Corrigido para o formato esperado
                valor_maximo: rule.valorMaximo, // Corrigido para o formato esperado
              }))}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              searchValue=""
              onSearch={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsPage;
