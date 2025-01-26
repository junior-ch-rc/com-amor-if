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

export const PontuacaoBarChart = ({ data, title }) => {
  // Organizar os dados por bimestre e senso
  const formattedData = Object.values(
    data.reduce((acc, item) => {
      const { bimestre, pontos, regra } = item;
      const senso = regra.senso.descricao;

      acc[bimestre] = acc[bimestre] || { bimestre };
      acc[bimestre][senso] = (acc[bimestre][senso] || 0) + pontos;

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
              dataKey={senso}
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
  // Agrupar pontuações por mês/ano e senso
  const formattedData = Object.values(
    data.reduce((acc, item) => {
      // Extrair o mês e ano para agrupar
      const date = new Date(item.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`; // Ex: "01/2025"
      const senso = item.regra.senso.descricao;
      const pontos = item.pontos;

      // Acumular os pontos por mês e senso
      acc[monthYear] = acc[monthYear] || { date: monthYear };
      acc[monthYear][senso] = (acc[monthYear][senso] || 0) + pontos;

      return acc;
    }, {})
  );

  // Ordenar as datas (mês/ano) cronologicamente
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
  // Lista fixa de todos os sensos possíveis
  const SENSOS = [
    "Limpeza",
    "Saúde",
    "Utilização",
    "Ordenação",
    "Autodisciplina",
  ]; // Ajuste conforme necessário

  // Agrupar pontuações por senso
  const pontosPorSenso = data.reduce((acc, item) => {
    const senso = item.regra.senso.descricao;
    acc[senso] = (acc[senso] || 0) + item.pontos;
    return acc;
  }, {});

  // Criar os dados do radar: incluir todos os sensos, mesmo que zerados
  const radarData = SENSOS.map((senso) => ({
    senso,
    pontos: pontosPorSenso[senso] || 0, // Se não tiver pontuação, manter 0
  }));

  return (
    <div className="bg-white p-4 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="senso" />
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
