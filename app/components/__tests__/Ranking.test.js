import { render, screen } from "@testing-library/react";
import Ranking from "../Ranking";

describe("Ranking", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("avisa de forma amigável quando ainda não há turmas", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<Ranking />);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "O ranking estará disponível em breve"
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Ainda não há turmas cadastradas para o ano letivo atual"
    );
  });

  it("continua exibindo normalmente as turmas recebidas", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, nome: "Turma A", descricao: "Primeiro ano", pontuacao: 10 },
      ],
    });

    render(<Ranking />);

    expect(await screen.findByText("Turma A")).toBeInTheDocument();
    expect(screen.queryByText(/ranking estará disponível/i)).not.toBeInTheDocument();
  });
});
