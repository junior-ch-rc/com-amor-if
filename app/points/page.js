"use client";

import { useState, useEffect } from "react";
import Tab from "../components/Tab";
import Table from "../components/Table";
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

  const [pontuacoes, setPontuacoes] = useState([]);
  const [filteredPontuacoes, setFilteredPontuacoes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const fetchPontuacoes = async () => {
    try {
      const data = await fetchPrivateData(
        "pontuacao/pontuacaoPorServidor",
        token
      );

      // Agrupar as pontuações por senso
      const groupedBySenso = data.reduce((acc, pontuacao) => {
        const senso = pontuacao.regra.senso.descricao || "Sem Senso";
        if (!acc[senso]) acc[senso] = [];
        acc[senso].push(pontuacao);
        return acc;
      }, {});

      console.log(groupedBySenso);

      setPontuacoes(groupedBySenso);
      setTotalPages(Math.ceil(data.length / 10)); // Ajuste conforme a quantidade de dados por página

      // Filtra inicialmente pela pesquisa
      filterPontuacoes(searchTerm);
    } catch (error) {
      setErrorMessage(
        "Erro ao carregar pontuações: " + error.response.data?.errors[0]
      );
    }
  };

  // Função para filtrar as pontuações com base no nome da turma
  const filterPontuacoes = (search) => {
    setSearchTerm(search);
    const filtered = pontuacoes[activeTab]?.filter((pontuacao) =>
      pontuacao.turma.nome.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPontuacoes(filtered);

    if (filtered?.length > 0) {
      setTotalPages(Math.ceil(filtered.length / itemsPerPage)); // Atualiza totalPages com o filtro aplicado
    }
  };

  // Chamada do fetch quando o componente é carregado ou quando a aba ativa muda
  useEffect(() => {
    if (user && isReady) {
      fetchPontuacoes();
    }
  }, [user, isReady, activeTab]);

  useEffect(() => {
    filterPontuacoes(searchTerm); // Atualiza o filtro sempre que o searchTerm mudar
  }, [pontuacoes, activeTab]);

  // Função de mudança de página
  const onPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
        setGroupedRules(grouped);

        // Define a aba ativa como a primeira
        if (Object.keys(grouped).length > 0) {
          setActiveTab(Object.keys(grouped)[0]);
        }
      } catch (error) {
        setErrorMessage(
          "Erro ao carregar regras: " + error.response.data.errors[0]
        );
      }
    };

    if (
      user !== null &&
      !(!isFromCategory(user, "Admin") && !isFromCategory(user, "Aval"))
    )
      fetchRules();
  }, [token, user]);

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

  const handleSubmit = async (
    formData,
    setFormData,
    setTipoRegra,
    setOperacao
  ) => {
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
      matricula_aluno: formData.matriculaAluno,
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

      setSuccessMessage("Pontuação lançada com sucesso");

      setFormData({
        idTurma: "",
        idRegra: "",
        pontos: "",
        operacao: "",
        motivacao: "",
        matriculaAluno: "",
        bimestre: 0,
        turno: "",
      });

      setTipoRegra(null);
      setOperacao(null);
      fetchPontuacoes();
    } catch (error) {
      setErrorMessage(
        "Erro ao enviar pontuação: " + error.response.data.errors[0]
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <MessageBox
          message={errorMessage}
          color="detail-minor"
          onClose={() => setErrorMessage(null)}
        />
      )}

      {successMessage && (
        <MessageBox
          message={successMessage}
          color="lime-400"
          onClose={() => setSuccessMessage(null)}
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
            onSubmit={handleSubmit}
            key={activeTab} // Força re-renderização ao mudar de aba
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
            ]}
            data={
              (filteredPontuacoes && filterPontuacoes.length) > 0
                ? filteredPontuacoes
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((pontuacao) => ({
                      nome_da_turma: pontuacao.nomeTurma,
                      regra: pontuacao.regra.descricao,
                      operacao:
                        pontuacao.operacao === "SUM" ? "Adição" : "Subtração",
                      pontos: pontuacao.pontos,
                      contador: pontuacao.contador,
                      aplicado: pontuacao.aplicado ? "Verdadeiro" : "Falso",
                      anulado: pontuacao.anulado ? "Verdadeiro" : "Falso",
                    }))
                : []
            }
            actions={[]}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            searchValue={searchTerm}
            onSearch={filterPontuacoes}
          />
        </div>
      )}
    </div>
  );
};

export default PointsPage;
