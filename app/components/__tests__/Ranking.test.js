import { render, screen } from "@testing-library/react";
import Ranking from "../Ranking";

describe("Ranking", () => {
  beforeEach(() => { global.fetch = jest.fn(); });
  afterEach(() => { jest.restoreAllMocks(); });

  it("avisa de forma amigável quando ainda não há turmas", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
    render(<Ranking />);
    expect(await screen.findByRole("status")).toHaveTextContent("O ranking estará disponível em breve");
  });

  it("ordena as turmas e mostra a distância para a posição anterior", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [
      { id: 2, nome: "Informática", descricao: "Infominds", pontuacao: 75 },
      { id: 1, nome: "Administração", descricao: "Admísticos", pontuacao: 100, anoLetivo: { ano_letivo: 2026 } },
    ] });
    render(<Ranking />);
    const items = await screen.findAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Admísticos");
    expect(items[0]).toHaveTextContent("Liderança");
    expect(screen.getByText("Disputa de 2026")).toBeInTheDocument();
    expect(items[1]).toHaveTextContent("Faltam 25 pts para o 1º lugar");
  });

  it("identifica empate na disputa pela posição", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => [
      { id: 1, nome: "Turma A", descricao: "Equipe A", pontuacao: 50 },
      { id: 2, nome: "Turma B", descricao: "Equipe B", pontuacao: 50 },
    ] });
    render(<Ranking />);
    expect(await screen.findByText("Empate na disputa pela posição")).toBeInTheDocument();
  });
});
