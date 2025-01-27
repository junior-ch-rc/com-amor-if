"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import LoadingSpinner from "../components/LoadingSpinner";
import MessageBox from "../components/MessageBox";
import Table from "../components/Table";
import {
  TurmaBarChart,
  PontuacaoEvolucaoChart,
  RadarSensoChart,
} from "../components/ReportsCharts";

const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

const itemsPerPage = 5;

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pontuacoes, setPontuacoes] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [turmasColors, setTurmasColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pontuacaoRes, turmasRes] = await Promise.all([
          fetch(`${apiUrl}pontuacao/pontosDoAnoCorrente`),
          fetch(`${apiUrl}public/pontuacao`),
        ]);

        if (!pontuacaoRes.ok || !turmasRes.ok) {
          throw new Error("Erro ao buscar os dados.");
        }

        const pontuacaoData = await pontuacaoRes.json();
        const turmasData = await turmasRes.json();

        setPontuacoes(pontuacaoData.filter((p) => p.aplicado));
        setTurmas(turmasData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Atribuindo cores fixas para cada turma
    const colorMap = turmas.reduce((acc, turma, index) => {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      acc[turma.id] = color;
      return acc;
    }, {});
    setTurmasColors(colorMap);
  }, [turmas]);

  if (loading) return <LoadingSpinner />;
  if (error) return <MessageBox message={error} color="detail-minor" />;

  // Cálculo de métricas
  const turmasPontuacao = {};
  const sensoPontuacao = {};
  const turmasPorMes = {}; // Para o gráfico de linha (por mês)

  pontuacoes.forEach((p) => {
    const { idTurma, nomeTurma, pontos, regra, operacao, createdAt } = p;
    const senso = regra.senso.descricao;

    // Atualizar o total de pontos por turma
    if (!turmasPontuacao[idTurma]) {
      turmasPontuacao[idTurma] = { nome: nomeTurma, total: 0, meses: {} };
    }

    turmasPontuacao[idTurma].total += operacao === "SUM" ? pontos : -pontos;

    // Para o gráfico de linha (agrupar por mês)
    const date = new Date(createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    turmasPontuacao[idTurma].meses[monthYear] =
      (turmasPontuacao[idTurma].meses[monthYear] || 0) +
      (operacao === "SUM" ? pontos : -pontos);

    // Atualizar a pontuação geral por senso
    if (!sensoPontuacao[senso]) sensoPontuacao[senso] = 0;
    sensoPontuacao[senso] += operacao === "SUM" ? pontos : -pontos;
  });

  // Garantir que todas as turmas apareçam, mesmo com pontuação 0
  turmas.forEach((turma) => {
    if (!turmasPontuacao[turma.id]) {
      turmasPontuacao[turma.id] = { nome: turma.nome, total: 0, meses: {} };
    }
  });

  // Organizar dados para gráficos
  const turmasArray = Object.values(turmasPontuacao);
  const sensoArray = Object.entries(sensoPontuacao).map(([senso, total]) => ({
    senso,
    total,
  }));

  // Dados para gráficos
  const chartData = turmasArray.map((t) => ({
    name: t.nome,
    pontuacao: t.total,
  }));

  const radarData = sensoArray.map((s) => ({
    senso: s.senso,
    Pontuação: s.total,
  }));

  // Dados para gráfico de linha (pontuação por mês de cada turma)
  const lineChartData = turmasArray.map((t) => {
    const meses = Object.keys(t.meses).sort((a, b) => {
      const [monthA, yearA] = a.split("/");
      const [monthB, yearB] = b.split("/");
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    const pontosPorMes = meses.map((mes) => ({
      date: mes,
      pontos: t.meses[mes] || 0, // Adicionando o ponto zero se não houver pontuação
    }));

    return { name: t.nome, data: pontosPorMes };
  });

  const sensoMaisPontuado = sensoArray.sort((a, b) => b.total - a.total)[0];
  const sensoMenosPontuado = sensoArray.sort((a, b) => a.total - b.total)[0];

  const filteredData = pontuacoes.filter((p) =>
    p.nomeTurma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Relatório Geral das Turmas</h1>

      {/* Resumo */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100">
        <h2 className="text-lg font-semibold">Resumo</h2>
        <p>
          <strong>Total de Turmas:</strong> {turmas.length}
        </p>
        <p>
          <strong>Senso mais pontuado:</strong> {sensoMaisPontuado.senso} (
          {sensoMaisPontuado.total} pontos)
        </p>
        <p>
          <strong>Senso menos pontuado:</strong> {sensoMenosPontuado.senso} (
          {sensoMenosPontuado.total} pontos)
        </p>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-white">
          <TurmaBarChart
            data={chartData}
            colors={turmasColors}
            title="Pontuação das Turmas"
          />
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <PontuacaoEvolucaoChart
            data={lineChartData}
            colors={turmasColors}
            title="Evolução da Pontuação"
          />
        </div>
        <div className="p-4 border rounded-lg bg-white">
          <RadarSensoChart data={radarData} title="Desempenho por Senso" />
        </div>
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
          "Registrado Em",
          "Criado Por",
          "Detalhes",
        ]}
        data={filteredData
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((p) => ({
            turma: p.nomeTurma,
            bimestre: p.bimestre,
            regra: p.regra.descricao,
            senso: p.regra.senso.descricao,
            operacao: p.operacao === "SUM" ? "Adição" : "Subtração",
            pontos: p.pontos,
            data: format(new Date(p.createdAt), "dd/MM/yyyy"),
            criadoPor: p.criadoPor.username,
            detalhes: `/report/${p.idTurma}`,
          }))}
      />
    </div>
  );
};

export default ReportsPage;
