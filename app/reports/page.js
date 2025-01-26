"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBox from "../components/MessageBox";
import Table from "../components/Table";
import {
  PontuacaoBarChart,
  PontuacaoLineChart,
  PontuacaoRadarChart,
} from "../components/Charts";

const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

const ReportPage = () => {
  const router = useRouter();
  const numeroDaTurma = router.query.turma;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!numeroDaTurma) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/public/pontuacaoPorTurma/${numeroDaTurma}`
        );
        if (!response.ok) throw new Error("Erro ao buscar os dados");
        const result = await response.json();
        setData(result);
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
        <div className="grid grid-cols-3 gap-4">
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

      <div className="grid grid-cols-3 gap-4">
        <PontuacaoBarChart data={data} title="Pontuação por Bimestre" />
        <PontuacaoLineChart data={data} title="Evolução da Pontuação" />
        <PontuacaoRadarChart data={data} title="Desempenho por Senso" />
      </div>

      <h2 className="text-xl font-semibold my-4">
        Detalhamento das Pontuações
      </h2>
      <Table
        searchText="Buscar pontuações..."
        headers={["Bimestre", "Regra", "Senso", "Pontos", "Registrado Em"]}
        data={data.map((item) => ({
          bimestre: item.bimestre,
          regra: item.regra.descricao,
          senso: item.regra.senso.descricao,
          pontos: item.pontos,
          registrado_em: format(
            new Date(item.createdAt),
            "dd/MM/yyyy HH:mm:ss"
          ),
        }))}
      />
    </div>
  );
};

export default ReportPage;
