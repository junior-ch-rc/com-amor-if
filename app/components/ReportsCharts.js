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
  PolarRadiusAxis,
} from "recharts";

export const TurmaBarChart = ({ turmasArray }) => {
  // Gráfico de barras (Pontuação total por turma)
  const data = turmasArray.map((t) => ({
    name: t.nome,
    pontuacao: t.total,
  }));

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-2">Pontuação das Turmas</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            interval={0}
            dataKey="name"
            tick={{ fontSize: window.innerWidth < 600 ? 8 : 12 }}
            angle={window.innerWidth < 600 ? -45 : -10}
            textAnchor="end"
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pontuacao" fill="#fa7373" name="Pontuação" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PontuacaoEvolucaoChart = ({ colors, turmasArray }) => {
  // Gráfico de linha (Pontuação por bimestre)

  // Coletamos todos os bimestres únicos
  const bimestresUnicos = new Set();
  turmasArray.forEach((turma) => {
    Object.keys(turma.bimestres).forEach((bimestre) =>
      bimestresUnicos.add(bimestre)
    );
  });

  // Ordenamos os bimestres corretamente
  const bimestresOrdenados = Array.from(bimestresUnicos).sort((a, b) => {
    const [bimA, yearA] = a;
    const [bimB, yearB] = b;
    return new Date(yearA, (bimA - 1) * 2) - new Date(yearB, (bimB - 1) * 2);
  });

  // Criamos o formato final esperado pelo Recharts
  const data = bimestresOrdenados.map((bimestre) => {
    let entry = { name: bimestre };
    turmasArray.forEach((turma) => {
      entry[turma.nome] = turma.bimestres[bimestre] || 0;
    });
    return entry;
  });

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-2">
        Evolução da Pontuação ao Longo do Tempo
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {turmasArray.map((turma) => (
            <Line
              key={turma.nome}
              type="monotone"
              dataKey={turma.nome}
              stroke={colors[turma.nome] || "#000"} // Usa cor padrão se não houver
              dot={{ r: 4 }} // Personaliza os pontos das linhas
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RadarSensoChart = ({ sensoArray }) => {
  // Gráfico de radar (Pontuação por senso)
  const data = sensoArray.map((s) => ({
    senso: s.senso,
    Pontuação: s.total,
  }));

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-2">
        Desempenho Médio dos Sensos
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
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
            name="Média"
            dataKey="Pontuação"
            stroke="#ffb536"
            fill="#ffb536"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
