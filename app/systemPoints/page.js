"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBox from "../components/MessageBox";
import { useAuth } from "../../providers/AuthProvider";
import Table from "../components/Table";
import { isFromCategory } from "../../utils/role";
import NotAuthorized from "../components/NotAuthorized";
import { postPrivateData } from "@/utils/api";

const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

const itemsPerPage = 10;

const SystemPointsPage = () => {
  const { getToken, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todasPontuacoes, setTodasPontuacoes] = useState([]);
  const [messages, setMessages] = useState({ error: null, success: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = getToken();
  const [formData, setFormData] = useState({
    bimestre: 0,
  });

  const fetchData = async () => {
    try {
      const [pontuacaoRes] = await Promise.all([
        fetch(`${apiUrl}pontuacao/pontosDoAnoCorrente`),
      ]);

      if (!pontuacaoRes.ok) {
        setError("Erro ao buscar os dados.");
      }

      const pontuacaoData = await pontuacaoRes.json();

      setTodasPontuacoes(pontuacaoData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (
    !user ||
    (!isFromCategory(user, "Admin") && !isFromCategory(user, "Aval"))
  )
    return <NotAuthorized />;

  if (loading) return <LoadingSpinner />;
  if (error) return <MessageBox message={error} color="detail-minor" />;

  const filteredData = todasPontuacoes.filter((p) =>
    p.nomeTurma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token)
      return setMessages({ error: "Token de autenticação não encontrado" });

    const dataToSend = {
      bimestre: formData.bimestre,
    };

    try {
      const response = await postPrivateData(
        "pontuacao/lancarPontosAutomaticos",
        dataToSend,
        token
      );

      if (response?.length === 0)
        setMessages({
          success: "Nenhuma turma elegível para pontuações de sistema",
        });
      else {
        setMessages({ success: "Pontuação lançada com sucesso" });
      }

      setFormData({
        bimestre: 0,
      });
      fetchData();
    } catch (error) {
      setMessages({
        error: "Erro ao enviar pontuação: " + error?.response?.data?.errors[0],
      });
    }
  };

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
      <h1 className="text-2xl font-bold mb-4">Lançar Pontos de Sistema</h1>

      {/* Resumo */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bimestre
            </label>
            <select
              name="bimestre"
              value={formData.bimestre}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border rounded"
              required
            >
              <option value="0">1º Bimestre</option>
              <option value="1">2º Bimestre</option>
              <option value="2">3º Bimestre</option>
              <option value="3">4º Bimestre</option>
            </select>
          </div>
          {/* Submit Button */}
          <div>
            <button
              className={`px-4 py-2 m-1 mb-6 text-md font-medium rounded bg-green-500`}
              type="submit"
            >
              Lançar Pontuações de Sistema
            </button>
          </div>
        </form>
      </div>

      {/* Tabela de Pontuações */}
      <h2 className="text-xl font-semibold my-4">Pontuações do Ano Corrente</h2>
      <Table
        searchText="Buscar por nome da turma..."
        headers={[
          "Turma",
          "Bimestre",
          "Senso",
          "Regra",
          "Operacao",
          "Pontos",
          "Status",
          "Registrado Em",
          "Criado Por",
          "Detalhes",
        ]}
        data={filteredData
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((p) => ({
            turma: p.nomeTurma,
            bimestre: p.bimestre === 4 ? "Extra" : p.bimestre + 1,
            regra: p.regra.descricao,
            senso: p.regra.senso.descricao,
            operacao: p.operacao === "SUM" ? "Adição" : "Subtração",
            pontos: p.pontos,
            status: p.aplicado
              ? "Aplicado"
              : p.anulado
              ? "Anulado"
              : "Pendente",
            data: format(new Date(p.createdAt), "dd/MM/yyyy"),
            criado_por: p.criadoPor.username,
            registrado_em: format(new Date(p.createdAt), "dd/MM/yyyy HH:mm:ss"),
            detalhes: (
              <Link
                href={`/reports/${p.idTurma}?nome=${p.nomeTurma}`}
                className="text-blue-500 hover:underline"
              >
                Ver detalhes
              </Link>
            ),
          }))}
        searchValue={searchTerm}
        onSearch={(value) => {
          setCurrentPage(1);
          setSearchTerm(value);
        }}
        page={currentPage}
        totalPages={
          Math.ceil(filteredData.length / itemsPerPage) > 1
            ? Math.ceil(filteredData.length / itemsPerPage)
            : 1
        }
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default SystemPointsPage;
