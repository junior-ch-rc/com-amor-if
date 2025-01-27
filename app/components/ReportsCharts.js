import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Radar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export const TurmaBarChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis interval={0} dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="pontuacao"
          fill="#000000" // Usando o índice para associar a cor
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PontuacaoEvolucaoChart = ({ data, colors }) => {
  console.log(data);

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-2">
        Evolução da Pontuação ao Longo do Tempo
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data[0]?.data || []}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pontos" stroke="#000000" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RadarSensoChart = ({ data }) => {
  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-2">
        Desempenho Médio dos Sensos
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="senso" />
          <Radar
            name="Média"
            dataKey="Pontuação"
            stroke="#FF5722"
            fill="#FF5722"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
