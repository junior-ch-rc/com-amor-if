"use client";

import { useEffect, useState } from "react";
import { FaCrown, FaFlagCheckered, FaMedal } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import MessageBox from "./MessageBox";

const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
const podiumStyles = [
  { label: "Ouro", card: "border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-100", position: "bg-amber-400 text-amber-950", bar: "from-amber-400 to-yellow-300" },
  { label: "Prata", card: "border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100", position: "bg-slate-300 text-slate-800", bar: "from-slate-400 to-slate-300" },
  { label: "Bronze", card: "border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100", position: "bg-orange-400 text-orange-950", bar: "from-orange-500 to-orange-300" },
];

const getBadge = (position, points) => {
  if (position === 0 && points > 0) return { text: "Liderança", icon: FaCrown };
  if (position < 3 && points > 0) return { text: "Top 3", icon: FaMedal };
  return null;
};

const Ranking = () => {
  const [turmas, setTurmas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const getTurmasPontuacao = async () => {
      try {
        const res = await fetch(`${apiUrl}public/pontuacao`);
        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);
        const data = await res.json();
        setTurmas([...data].sort((a, b) => b.pontuacao - a.pontuacao));
      } catch {
        setErrorMessage("Erro ao carregar o ranking. Por favor, tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    getTurmasPontuacao();
  }, []);

  const leaderPoints = Math.max(Number(turmas[0]?.pontuacao) || 0, 1);
  const schoolYear = turmas[0]?.anoLetivo?.ano_letivo;

  return (
    <section id="ranking" aria-labelledby="ranking-title" className="mx-auto mt-6 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light px-4 py-5 text-white sm:px-8 sm:py-6">
        <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-accent/20" />
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-2 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider sm:text-sm"><FaFlagCheckered aria-hidden="true" />{schoolYear ? `Disputa de ${schoolYear}` : "Disputa do ano letivo"}</div>
          <h2 id="ranking-title" className="text-2xl font-black sm:text-3xl">Corrida das Turmas</h2>
          <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">Cada ponto aproxima sua turma do pódio. Quem vai conquistar a liderança?</p>
        </div>
      </header>

      <div className="p-3 sm:p-5 md:p-6">
        {isLoading && <LoadingSpinner />}
        {errorMessage && <MessageBox message={errorMessage} color="detail-minor" onClose={() => setErrorMessage(null)} />}
        {!isLoading && !errorMessage && turmas.length === 0 && (
          <div role="status" className="rounded-xl bg-gray-100 px-5 py-8 text-center text-gray-700">
            <p className="text-lg font-semibold">O ranking estará disponível em breve!</p>
            <p className="mt-2 text-sm sm:text-base">Ainda não há turmas cadastradas para o ano letivo atual.</p>
          </div>
        )}
        {!isLoading && !errorMessage && turmas.length > 0 && (
          <ol className="space-y-2.5 sm:space-y-3" aria-label="Classificação das turmas">
            {turmas.map((turma, index) => {
              const points = Number(turma.pontuacao) || 0;
              const progress = Math.max(0, Math.min(100, (points / leaderPoints) * 100));
              const previousPoints = Number(turmas[index - 1]?.pontuacao) || 0;
              const gap = index > 0 ? Math.max(0, previousPoints - points) : 0;
              const podium = podiumStyles[index];
              const badge = getBadge(index, points);
              const BadgeIcon = badge?.icon;
              return (
                <li key={turma.id} className={`ranking-card relative rounded-xl border p-3 shadow-sm transition duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md sm:px-4 sm:py-3.5 ${podium ? podium.card : "border-gray-200 bg-gray-50"}`} style={{ animationDelay: `${Math.min(index * 60, 420)}ms` }}>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black shadow-sm sm:h-10 sm:w-10 sm:text-sm ${podium ? podium.position : "bg-white text-gray-700 ring-1 ring-gray-200"}`} aria-label={`${index + 1}º lugar${podium ? `, medalha de ${podium.label}` : ""}`}>
                      {index + 1}º
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-sm font-bold text-gray-900 sm:text-base">{turma.descricao}</h3>
                            {badge && <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[0.68rem] font-bold uppercase tracking-wide text-primary-dark ring-1 ring-primary/15 sm:text-xs"><BadgeIcon aria-hidden="true" />{badge.text}</span>}
                          </div>
                          <p className="mt-0.5 break-words text-xs text-gray-600 sm:text-sm">{turma.nome}</p>
                        </div>
                        <p className="shrink-0 text-right text-base font-black tabular-nums text-primary-dark sm:text-lg">{points.toLocaleString("pt-BR")} <span className="text-[0.65rem] font-bold sm:text-xs">pts</span></p>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10" aria-hidden="true">
                        <div className={`ranking-progress h-full origin-left rounded-full bg-gradient-to-r ${podium?.bar || "from-primary to-primary-light"}`} style={{ width: `${progress}%` }} />
                      </div>
                      {index > 0 && <p className="mt-1.5 text-[0.7rem] font-medium text-gray-600 sm:text-xs">{gap > 0 ? `Faltam ${gap.toLocaleString("pt-BR")} pts para o ${index}º lugar` : "Empate na disputa pela posição"}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
};

export default Ranking;
