import React from "react";
import {
  BarChart,
  LineChart,
  Line,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SENSE_COLORS = {
  Limpeza: "#18a08c",
  Saúde: "#49c8aa",
  Utilização: "#ffbb03",
  Ordenação: "#ff941b",
  Autodisciplina: "#ff8486",
};

export const PontuacaoPositivaBarChart = ({ data, title }) => {
  // Organizar os dados por bimestre e separar os pontos positivos
  const formattedData = Object.values(
    data.reduce((acc, item) => {
      const { bimestre, pontos, regra, operacao } = item;
      const senso = regra.senso.descricao;

      // Verificar a operação para definir se os pontos são positivos ou negativos
      const pontosCorrigidos = operacao === "SUB" ? -pontos : pontos;

      acc[bimestre] = acc[bimestre] || { bimestre };
      acc[bimestre][`${senso}`] = acc[bimestre][`${senso}`] || 0;

      // Adicionar pontos positivos
      if (pontosCorrigidos > 0) {
        acc[bimestre][`${senso}`] += pontosCorrigidos;
      }

      return acc;
    }, {})
  );

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <XAxis dataKey="bimestre" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(SENSE_COLORS).map((senso) => (
            <Bar
              key={senso}
              dataKey={`${senso}`}
              fill={SENSE_COLORS[senso]}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PontuacaoNegativaBarChart = ({ data, title }) => {
  // Organizar os dados por bimestre e separar os pontos negativos
  const formattedData = Object.values(
    data.reduce((acc, item) => {
      const { bimestre, pontos, regra, operacao } = item;
      const senso = regra.senso.descricao;

      // Verificar a operação para definir se os pontos são positivos ou negativos
      const pontosCorrigidos = operacao === "SUB" ? -pontos : pontos;

      acc[bimestre] = acc[bimestre] || { bimestre };
      acc[bimestre][`${senso}`] = acc[bimestre][`${senso}`] || 0;

      // Adicionar pontos negativos
      if (pontosCorrigidos < 0) {
        acc[bimestre][`${senso}`] += pontosCorrigidos;
      }

      return acc;
    }, {})
  );

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <XAxis dataKey="bimestre" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(SENSE_COLORS).map((senso) => (
            <Bar
              key={senso}
              dataKey={`${senso}`}
              fill={SENSE_COLORS[senso]}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PontuacaoLineChart = ({ data, title }) => {
  const formattedData = Object.values(
    data.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const senso = item.regra.senso.descricao;
      const pontosCorrigidos =
        item.operacao === "SUB" ? -item.pontos : item.pontos;

      acc[monthYear] = acc[monthYear] || { date: monthYear };
      acc[monthYear][senso] = (acc[monthYear][senso] || 0) + pontosCorrigidos;

      return acc;
    }, {})
  );

  const sortedData = formattedData.sort((a, b) => {
    const [monthA, yearA] = a.date.split("/");
    const [monthB, yearB] = b.date.split("/");
    return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
  });

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(SENSE_COLORS).map((senso) => (
            <Line
              key={senso}
              type="monotone"
              dataKey={senso}
              stroke={SENSE_COLORS[senso]}
              dot={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PontuacaoRadarChart = ({ data, title }) => {
  const SENSOS = [
    "Limpeza",
    "Saúde",
    "Utilização",
    "Ordenação",
    "Autodisciplina",
  ];

  const pontosPorSenso = data.reduce((acc, item) => {
    const senso = item.regra.senso.descricao;
    const pontosCorrigidos =
      item.operacao === "SUB" ? -item.pontos : item.pontos;
    acc[senso] = (acc[senso] || 0) + pontosCorrigidos;
    return acc;
  }, {});

  const radarData = SENSOS.map((senso) => ({
    senso,
    pontos: pontosPorSenso[senso],
  }));

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="senso" />
          <PolarRadiusAxis />
          <Radar
            name="Pontuação"
            dataKey="pontos"
            stroke="#ffb536"
            fill="#ffb536"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
