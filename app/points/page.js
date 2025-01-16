"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Tab from "../components/Tab";
import Table from "../components/Table";
import MessageBox from "../components/MessageBox";
import NotAuthorized from "../components/NotAuthorized";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { fetchPrivateData, postPrivateData } from "../utils/api";
import { useAuth } from "../providers/AuthProvider";
import PontuacaoForm from "../components/PontuacaoForm";
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
  const { user, isLoading, getToken } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPoint, setDeletingPoint] = useState(null);
  const [groupedRules, setGroupedRules] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [messages, setMessages] = useState({ error: null, success: null });
  const [pontuacoes, setPontuacoes] = useState({});
  const [filteredPontuacoes, setFilteredPontuacoes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const token = getToken();
  const itemsPerPage = 10;

  const fetchPontuacoes = async () => {
    try {
      const data = await fetchPrivateData(
        "pontuacao/pontuacaoPorServidor",
        token
      );
      const groupedBySenso = data.reduce((acc, pontuacao) => {
        const senso = pontuacao.regra.senso.descricao || "Sem Senso";
        acc[senso] = acc[senso] ? [...acc[senso], pontuacao] : [pontuacao];
        return acc;
      }, {});
      setPontuacoes(groupedBySenso);
    } catch (error) {
      setMessages({
        error:
          "Erro ao carregar pontuações: " + error?.response?.data?.errors[0],
      });
    }
  };

  const fetchRules = async () => {
    try {
      const data = await fetchPrivateData("regras/permitidas", token);
      const grouped = data.reduce((acc, rule) => {
        const senso = rule.senso?.descricao || "Sem Senso";
        acc[senso] = acc[senso] ? [...acc[senso], rule] : [rule];
        return acc;
      }, {});
      setGroupedRules(grouped);
      setActiveTab(Object.keys(grouped)[0] || null);
    } catch (error) {
      setMessages({
        error: "Erro ao carregar regras: " + error?.response?.data?.errors[0],
      });
    }
  };

  const handleSubmit = async (
    formData,
    setFormData,
    setTipoRegra,
    setOperacao
  ) => {
    if (!token)
      return setMessages({ error: "Token de autenticação não encontrado" });

    const dataToSend = {
      id_turma: formData.idTurma,
      id_regra: formData.idRegra,
      pontos: formData.pontos,
      motivacao: formData.motivacao,
      matricula_aluno: formData.matriculaAluno,
      bimestre: formData.bimestre,
      turno: formData.turno,
    };

    try {
      await postPrivateData("pontuacao/lancar", dataToSend, token);
      setMessages({ success: "Pontuação lançada com sucesso" });
      setFormData({
        idTurma: "",
        idRegra: "",
        pontos: "",
        motivacao: "",
        matriculaAluno: "",
        bimestre: 0,
        turno: "",
      });
      setTipoRegra(null);
      setOperacao(null);
      fetchPontuacoes();
    } catch (error) {
      setMessages({
        error: "Erro ao enviar pontuação: " + error?.response?.data?.errors[0],
      });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
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
      fetchPontuacoes();
      setDeleteModalOpen(false);
      setDeletingPoint(null);
    } catch (error) {
      setMessages({
        error: "Erro ao deletar pontuacao: " + error?.response?.data?.errors[0],
      });
    }
  };

  const filterPontuacoes = (search) => {
    setSearchTerm(search);
    const filtered = pontuacoes[activeTab]?.filter((pontuacao) =>
      pontuacao.turma.nome.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPontuacoes(filtered);
  };

  const onPageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(filteredPontuacoes.length / itemsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      fetchRules();
      fetchPontuacoes();
    }
  }, [user, isLoading, token]);

  useEffect(() => {
    filterPontuacoes(searchTerm);
  }, [pontuacoes, activeTab]);

  if (isLoading) return <LoadingSpinner />;
  if (
    !user ||
    (!isFromCategory(user, "Admin") && !isFromCategory(user, "Aval"))
  )
    return <NotAuthorized />;

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

      <h1 className="text-2xl font-bold mb-4">Lançar Pontuação</h1>

      <div className="overflow-x-auto flex flex-nowrap gap-2 border-b border-gray-300 mb-4">
        <Tab
          tabs={Object.keys(groupedRules)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
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
            setErrorMessage={setMessages}
            onSubmit={handleSubmit}
            key={activeTab}
            regrasDisponiveis={groupedRules[activeTab]}
          />
          <h2
            className="text-xl font-semibold my-8"
            style={{ color: SENSE_COLORS[activeTab] }}
          >
            Pontuações Registradas
          </h2>

          <Table
            headers={[
              "Nome da Turma",
              "Regra",
              "Operacao",
              "Pontos",
              "Aplicado",
              "Anulado",
              "Registrado Em",
            ]}
            data={
              filteredPontuacoes && filteredPontuacoes.length > 0
                ? filteredPontuacoes
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((pontuacao) => ({
                      nome_da_turma: pontuacao.turma.nome,
                      regra: pontuacao.regra.descricao,
                      operacao:
                        pontuacao.operacao === "SUM" ? "Adição" : "Subtração",
                      pontos: pontuacao.pontos,
                      contador: pontuacao.contador,
                      aplicado: pontuacao.aplicado ? "Verdadeiro" : "Falso",
                      anulado: pontuacao.anulado ? "Verdadeiro" : "Falso",
                      registrado_em: format(
                        new Date(pontuacao.createdAt),
                        "dd/MM/yyyy HH:mm:ss"
                      ),
                      id_turma: pontuacao.idTurma,
                    }))
                : []
            }
            actions={[
              { label: "Deletar", color: "bg-red-500", onClick: handleDelete },
            ]}
            page={currentPage}
            totalPages={
              filteredPontuacoes && filteredPontuacoes.length > 0
                ? Math.ceil(filteredPontuacoes.length / itemsPerPage)
                : 1
            }
            onPageChange={onPageChange}
            searchValue={searchTerm}
            onSearch={filterPontuacoes}
          />
        </div>
      )}

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

export default PointsPage;
