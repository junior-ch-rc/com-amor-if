"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import LoadingSpinner from "../../components/LoadingSpinner";
import MessageBox from "../../components/MessageBox";
import Table from "../../components/Table";
import {
  PontuacaoBarChart,
  PontuacaoLineChart,
  PontuacaoRadarChart,
} from "../../components/Charts";

const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

const itemsPerPage = 2;

const SENSE_COLORS = {
  Limpeza: "#18a08c",
  Saúde: "#49c8aa",
  Utilização: "#ffbb03",
  Ordenação: "#ff941b",
  Autodisciplina: "#ff8486",
};

const ReportPage = () => {
  const params = useParams();
  const numeroDaTurma = params["turma"];

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!numeroDaTurma) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}public/pontuacaoPorTurma?turmaId=${numeroDaTurma}`
        );
        if (!response.ok) throw new Error("Erro ao buscar os dados");
        const result = await response.json();

        const appliedPoints = result.filter((point) => point.aplicado === true);

        setData(appliedPoints);
        setAllData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [numeroDaTurma]);

  if (loading) return <LoadingSpinner />;
  if (error) return <MessageBox message={error} color="red" />;

  if (data.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Relatório da Turma {numeroDaTurma}
        </h1>
        <MessageBox message="Não há dados para exibir" color="yellow" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PontuacaoBarChart data={[]} title="Pontuação por Bimestre" />
          <PontuacaoLineChart data={[]} title="Evolução da Pontuação" />
          <PontuacaoRadarChart data={[]} title="Desempenho por Senso" />
        </div>
      </div>
    );
  }

  const totalPontos = data.reduce((sum, item) => sum + item.pontos, 0);
  const positivos = data
    .filter((item) => item.pontos > 0)
    .reduce((sum, item) => sum + item.pontos, 0);
  const negativos = data
    .filter((item) => item.pontos < 0)
    .reduce((sum, item) => sum + item.pontos, 0);

  const filteredAllPoints = allData.filter((p) =>
    p.regra.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Relatório da Turma {numeroDaTurma}
      </h1>

      <div className="mb-4 p-4 border rounded-md bg-gray-100">
        <h2 className="text-lg font-semibold">Resumo</h2>
        <p>
          <strong>Total de Pontos:</strong> {totalPontos}
        </p>
        <p>
          <strong>Soma dos Pontos Positivos:</strong> {positivos}
        </p>
        <p>
          <strong>Soma dos Pontos Negativos:</strong> {negativos}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-white">
          <PontuacaoBarChart data={data} title="Pontuação por Bimestre" />
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <PontuacaoLineChart data={data} title="Evolução da Pontuação" />
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <PontuacaoRadarChart data={data} title="Desempenho por Senso" />
        </div>
      </div>

      <h2 className="text-xl font-semibold my-4">
        Detalhamento das Pontuações
      </h2>
      <Table
        searchText="Buscar pela regra..."
        headers={[
          "Bimestre",
          "Regra",
          "Operacao",
          "Pontos",
          "Aplicado",
          "Anulado",
          "Registrado Em",
          "Registrado Por",
        ]}
        data={filteredAllPoints
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((pontuacao) => ({
            bimestre: pontuacao.bimestre,
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
        searchValue={searchTerm}
        onSearch={(value) => {
          setCurrentPage(1);
          setSearchTerm(value);
        }}
        page={currentPage}
        totalPages={
          Math.ceil(filteredAllPoints.length / itemsPerPage) > 1
            ? Math.ceil(filteredAllPoints.length / itemsPerPage)
            : 1
        }
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ReportPage;
