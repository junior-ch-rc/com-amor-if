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
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const SENSE_COLORS = {
  Limpeza: "#18a08c",
  Saúde: "#49c8aa",
  Utilização: "#ffbb03",
  Ordenação: "#ff941b",
  Autodisciplina: "#ff8486",
};

export const PontuacaoBarChart = ({ data, title }) => {
  // Organizar os dados por bimestre e acumular os pontos por senso
  const formattedData = Object.values(
    data.reduce((acc, item) => {
      const { bimestre, pontos, regra, operacao } = item;
      const senso = regra.senso.descricao;

      // Verificar a operação para definir se os pontos são positivos ou negativos
      const pontosCorrigidos = operacao === "SUB" ? -pontos : pontos;

      // Inicializa o bimestre
      acc[bimestre] = acc[bimestre] || { name: `${bimestre}` };

      // Acumula os pontos de cada senso
      acc[bimestre][senso] = (acc[bimestre][senso] || 0) + pontosCorrigidos;

      return acc;
    }, {})
  );

  // Transformar o objeto de dados em um array para o gráfico
  const chartData = Object.values(formattedData).map((item) => {
    const finalItem = { ...item };
    Object.keys(item).forEach((key) => {
      // Zerar valores caso o senso não exista no bimestre
      if (!item[key]) {
        finalItem[key] = 0;
      }
    });
    return finalItem;
  });

  console.log(formattedData);

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />

          {/* Barra para cada senso */}
          {formattedData.map((senso, index) => (
            <Bar
              key={index}
              dataKey={senso.name} // Usando o nome do senso como dataKey
              fill={SENSE_COLORS[senso]} // Cor para cada senso
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
      const bimestre = item.bimestre; // Assume que 'item.bimestre' já está presente no objeto
      const senso = item.regra.senso.descricao;
      const pontosCorrigidos =
        item.operacao === "SUB" ? -item.pontos : item.pontos;

      // Agrupa pelos bimestres
      acc[bimestre] = acc[bimestre] || { date: `${bimestre}` };
      acc[bimestre][senso] = (acc[bimestre][senso] || 0) + pontosCorrigidos;

      return acc;
    }, {})
  );

  // Ordena os bimestres de acordo com a sequência (Bimestre 1, Bimestre 2, ...)
  const sortedData = formattedData.sort((a, b) => {
    const bimestreA = parseInt(a.date.split(" ")[1], 10);
    const bimestreB = parseInt(b.date.split(" ")[1], 10);
    return bimestreA - bimestreB;
  });

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <XAxis dataKey="date" interval={0} />
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
          <PolarAngleAxis
            dataKey="senso"
            tick={{
              fontSize: window.innerWidth < 600 ? 8 : 14,
              angle: window.innerWidth < 600 ? -40 : 0,
            }}
          />
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
