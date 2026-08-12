import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PontuacaoForm from "../PontuacaoForm";
import { fetchPrivateData } from "../../../utils/api";

jest.mock("../../../utils/api", () => ({
  fetchPrivateData: jest.fn(),
}));

jest.mock("../../../providers/AuthProvider", () => ({
  useAuth: () => ({ getToken: () => "token-de-teste" }),
}));

const fixedRule = {
  id: 1,
  descricao: "Pontos fixos por empréstimo",
  categoria: "Biblioteca",
  operacao: "SUM",
  valorMinimo: 5,
  valorMaximo: 5,
  tipoRegra: { fixo: true, porTurno: false, frequencia: 0 },
};

const variableRule = {
  id: 2,
  descricao: "Ocorrência no laboratório",
  categoria: "Laboratório",
  operacao: "SUB",
  valorMinimo: 2,
  valorMaximo: 10,
  tipoRegra: { fixo: false, porTurno: true, frequencia: 1 },
};

describe("PontuacaoForm com seletor de regras pesquisável", () => {
  beforeEach(() => {
    fetchPrivateData.mockResolvedValue([{ id: "turma-1", nome: "1º Informática" }]);
  });

  it("mantém os efeitos de uma regra fixa ao selecioná-la pela busca", async () => {
    const user = userEvent.setup();
    render(
      <PontuacaoForm
        regrasDisponiveis={[fixedRule, variableRule]}
        onSubmit={jest.fn()}
        setErrorMessage={jest.fn()}
      />
    );

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.click(
      screen.getByRole("option", { name: fixedRule.descricao })
    );

    expect(screen.getByText("Operação de adição")).toBeInTheDocument();
    expect(screen.getByText("5 pontos (valor fixo)")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Turma" })).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Turno" })).not.toBeInTheDocument();
  });

  it("continua ajustando os campos condicionais ao trocar para uma regra variável", async () => {
    const user = userEvent.setup();
    render(
      <PontuacaoForm
        regrasDisponiveis={[fixedRule, variableRule]}
        onSubmit={jest.fn()}
        setErrorMessage={jest.fn()}
      />
    );

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.click(
      screen.getByRole("option", { name: variableRule.descricao })
    );

    expect(screen.getByText("Operação de subtração")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Turno" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Bimestre" })).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Pontos" })).toHaveAttribute(
      "min",
      "2"
    );
    expect(screen.getByRole("spinbutton", { name: "Pontos" })).toHaveAttribute(
      "max",
      "10"
    );
  });

  it("envia a regra selecionada pela busca sem alterar o contrato do formulário", async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(
      <PontuacaoForm
        regrasDisponiveis={[fixedRule]}
        onSubmit={onSubmit}
        setErrorMessage={jest.fn()}
      />
    );

    await waitFor(() => expect(fetchPrivateData).toHaveBeenCalled());
    await user.click(screen.getByRole("combobox", { name: /buscar regra/i }));
    await user.click(
      screen.getByRole("option", { name: fixedRule.descricao })
    );
    await user.selectOptions(screen.getByRole("combobox", { name: "Turma" }), "turma-1");
    await user.click(screen.getByRole("button", { name: "Registrar Pontuação" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        idRegra: "1",
        idTurma: "turma-1",
        pontos: 5,
        operacao: "SUM",
      }),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });
});
