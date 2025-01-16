"use client";

import { useState, useEffect } from "react";
import Tab from "../components/Tab";
import Table from "../components/Table";
import MessageBox from "../components/MessageBox";
import NotAuthorized from "../components/NotAuthorized";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { fetchPrivateData, postPrivateData } from "../utils/api";
import { useAuth } from "../providers/AuthProvider";
import { format } from "date-fns";

const tabs = [
  {
    label: "Pontos a Validar",
    endpoint: "pontuacao/pontosDoAnoCorrenteParaValidar",
  },
  {
    label: "Pontos Aplicados",
    endpoint: "pontuacao/pontosDoAnoCorrenteAplicados",
  },
  {
    label: "Pontos Anulados",
    endpoint: "pontuacao/pontosDoAnoCorrenteAnulados",
  },
  { label: "Todos os Pontos", endpoint: "pontuacao/pontosDoAnoCorrente" },
];

const TABS_COLORS = {
  "Pontos a Validar": "#18a08c",
  "Pontos Aplicados": "#49c8aa",
  "Todos os Pontos": "#ffbb03",
  "Pontos Anulados": "#ff8486",
};

const itemsPerPage = 10;

const PointsValidationPage = () => {
  const { user, isLoading, getToken } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPoint, setDeletingPoint] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const [messages, setMessages] = useState({ error: null, success: null });
  const [pointsData, setPointsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const token = getToken();

  const fetchPoints = async (endpoint) => {
    try {
      const data = await fetchPrivateData(endpoint, token);
      setPointsData(data);
    } catch (error) {
      setMessages({
        error: "Erro ao carregar dados: " + error?.response?.data?.errors[0],
      });
    }
  };

  useEffect(() => {
    const defaultTab = tabs.find((tab) => tab.label === activeTab);
    if (defaultTab) fetchPoints(defaultTab.endpoint);
  }, [activeTab, token]);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <NotAuthorized />;

  // Função para definir as ações conforme a aba ativa
  const getActions = (tab) => {
    switch (tab) {
      case "Pontos a Validar":
        return [
          { label: "Deletar", color: "bg-red-500", onClick: handleDelete },
          { label: "Aplicar", color: "bg-green-500", onClick: handleApply },
          { label: "Anular", color: "bg-yellow-500", onClick: handleAnnul },
        ];
      case "Pontos Aplicados":
        return [
          { label: "Anular", color: "bg-yellow-500", onClick: handleAnnul },
        ];
      case "Pontos Anulados":
        return [
          { label: "Aplicar", color: "bg-green-500", onClick: handleApply },
        ];
      default:
        return [];
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleDelete = (pontuacao) => {
    setDeletingPoint(pontuacao);
    setDeleteModalOpen(true);
  };

  const deletePoints = async () => {
    if (!token)
      return setMessages({ error: "Token de autenticação não encontrado" });

    const dataToSend = {
      id_turma: deletingPoint.id_turma,
      contador: deletingPoint.contador,
    };

    try {
      await postPrivateData("pontuacao/deletarPontuacao", dataToSend, token);
      setMessages({ success: "Pontuação deletada com sucesso" });

      fetchPoints(tabs.find((tab) => tab.label === activeTab).endpoint);
      setDeleteModalOpen(false);
      setDeletingPoint(null);
    } catch (error) {
      setMessages({
        error: "Erro ao deletar pontuacao: " + error?.response?.data?.errors[0],
      });
    }
  };

  const handleApply = async (point) => {
    if (!token)
      return setMessages({ error: "Token de autenticação não encontrado" });

    const dataToSend = {
      id_turma: point.id_turma,
      contador: point.contador,
    };

    try {
      await postPrivateData("manager/aprovar", dataToSend, token);
      setMessages({ success: "Pontuação aplicada com sucesso" });

      console.log(tabs.find((tab) => tab.label === activeTab).endpoint);

      fetchPoints(tabs.find((tab) => tab.label === activeTab).endpoint);
      setDeleteModalOpen(false);
      setDeletingPoint(null);
    } catch (error) {
      setMessages({
        error: "Erro ao aplicar pontuacao: " + error?.response?.data?.errors[0],
      });
    }
  };

  const handleAnnul = async (point) => {
    if (!token)
      return setMessages({ error: "Token de autenticação não encontrado" });

    const dataToSend = {
      id_turma: point.id_turma,
      contador: point.contador,
    };

    try {
      await postPrivateData("manager/cancelar", dataToSend, token);
      setMessages({ success: "Pontuação anulada com sucesso" });

      fetchPoints(tabs.find((tab) => tab.label === activeTab).endpoint);
      setDeleteModalOpen(false);
      setDeletingPoint(null);
    } catch (error) {
      setMessages({
        error: "Erro ao anular pontuacao: " + error?.response?.data?.errors[0],
      });
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredPoints = pointsData.filter((p) =>
    p.turma.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {messages.error && (
        <MessageBox
          message={messages.error}
          color="detail-minor"
          onClose={() => setMessages({ ...messages, error: null })}
        />
      )}
      {messages.success && (
        <MessageBox
          message={messages.success}
          color="lime-400"
          onClose={() => setMessages({ ...messages, success: null })}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Validação de Pontuações</h1>

      {/* Componente de Abas */}
      <Tab
        tabs={tabs.map((tab) => tab.label)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabColors={TABS_COLORS}
      />

      <br></br>

      {/* Tabela com Paginação e Ações Dinâmicas */}
      <Table
        headers={[
          "Nome da Turma",
          "Regra",
          "Operacao",
          "Pontos",
          "Aplicado",
          "Anulado",
          "Registrado Em",
          "Registrado Por",
        ]}
        data={filteredPoints
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((pontuacao) => ({
            nome_da_turma: pontuacao.turma.nome,
            contador: pontuacao.contador,
            id_turma: pontuacao.turma.id,
            regra: pontuacao.regra.descricao,
            operacao: pontuacao.operacao === "SUM" ? "Adição" : "Subtração",
            pontos: pontuacao.pontos,
            aplicado: pontuacao.aplicado ? "Verdadeiro" : "Falso",
            anulado: pontuacao.anulado ? "Verdadeiro" : "Falso",
            registrado_em: format(
              new Date(pontuacao.createdAt),
              "dd/MM/yyyy HH:mm:ss"
            ),
            registrado_por: pontuacao.criadoPor.username,
          }))}
        actions={getActions(activeTab)}
        page={currentPage}
        totalPages={
          Math.ceil(filteredPoints.length / itemsPerPage) > 1
            ? Math.ceil(filteredPoints.length / itemsPerPage)
            : 1
        }
        onPageChange={onPageChange}
        searchValue={searchTerm}
        onSearch={setSearchTerm}
      />

      <Modal
        title={"Deletar Pontuação"}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSave={deletePoints}
      >
        <p>Tem certeza que deseja deletar essa pontuação?</p>
      </Modal>
    </div>
  );
};

export default PointsValidationPage;
