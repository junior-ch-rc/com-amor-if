import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RuleSelect, {
  UNGROUPED_RULES_LABEL,
  getRuleDisplayDescription,
  groupRulesByCategory,
  isTurboRule,
} from "../RuleSelect";

const rules = [
  {
    id: 1,
    descricao: "Organização dos materiais",
    categoria: "Rotina",
    grupo: "exclusividade-organização",
    operacao: "SUM",
  },
  {
    id: 2,
    descricao: "Livro devolvido no prazo",
    categoria: "Biblioteca",
    grupo: "exclusividade-acervo",
    operacao: "SUB",
  },
  {
    id: 3,
    descricao: "Uso adequado do laboratório",
    categoria: "Laboratório",
    operacao: "SUM",
  },
  {
    id: 4,
    descricao: "[TURBO] Participação em evento",
    categoria: null,
    operacao: "SUM",
    valorMinimo: 30,
  },
];

describe("groupRulesByCategory", () => {
  it("mantém as regras no grupo informado e cria um grupo seguro para as sem grupo", () => {
    expect(groupRulesByCategory(rules)).toEqual({
      Rotina: [rules[0]],
      Biblioteca: [rules[1]],
      Laboratório: [rules[2]],
      [UNGROUPED_RULES_LABEL]: [rules[3]],
    });
  });
});

describe("apresentação TURBO", () => {
  it("deriva o destaque do valor mínimo e remove o marcador da exibição", () => {
    expect(isTurboRule({ valorMinimo: 30 })).toBe(true);
    expect(isTurboRule({ valorMinimo: 29 })).toBe(false);
    expect(getRuleDisplayDescription("[TURBO] Regra especial")).toBe(
      "Regra especial"
    );
  });
});

describe("RuleSelect", () => {
  it("desativa sugestões automáticas do navegador no campo de busca", () => {
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={jest.fn()} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    expect(search).toHaveAttribute("autocomplete", "off");
    expect(search).toHaveAttribute("autocorrect", "off");
    expect(search).toHaveAttribute("spellcheck", "false");
  });

  it("mostra as regras disponíveis agrupadas por contexto", async () => {
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={jest.fn()} />);

    await user.click(screen.getByRole("combobox", { name: /buscar regra/i }));

    expect(screen.getByRole("heading", { name: "Rotina" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Biblioteca" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Laboratório" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: UNGROUPED_RULES_LABEL })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "exclusividade-organização" })
    ).not.toBeInTheDocument();
  });

  it("diferencia visual e semanticamente operações de adição e subtração", async () => {
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={jest.fn()} />);

    await user.click(screen.getByRole("combobox", { name: /buscar regra/i }));

    const addition = screen.getByRole("option", {
      name: "Organização dos materiais",
    });
    const subtraction = screen.getByRole("option", {
      name: "Livro devolvido no prazo",
    });

    expect(addition).toHaveAccessibleDescription("Operação de adição.");
    expect(addition).toHaveClass("hover:bg-green-50");
    expect(subtraction).toHaveAccessibleDescription("Operação de subtração.");
    expect(subtraction).toHaveClass("hover:bg-red-50");
  });

  it("substitui o marcador TURBO por um foguete e permite buscar pelo destaque", async () => {
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={jest.fn()} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.type(search, "turbo");

    const turboOption = screen.getByRole("option", {
      name: "Participação em evento",
    });
    expect(turboOption).toHaveAccessibleDescription(
      "Operação de adição. Regra TURBO."
    );
    expect(turboOption).not.toHaveTextContent("[TURBO]");
  });

  it("mantém o foguete no campo selecionado sem exibir o marcador textual", () => {
    render(<RuleSelect rules={rules} selectedRuleId="4" onChange={jest.fn()} />);

    expect(screen.getByRole("img", { name: "Regra TURBO" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /buscar regra/i })).toHaveValue(
      "Participação em evento"
    );
  });

  it("busca pela descrição sem diferenciar maiúsculas, minúsculas ou acentos", async () => {
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={jest.fn()} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.type(search, "organizacao");

    expect(
      screen.getByRole("option", { name: "Organização dos materiais" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Rotina" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Livro devolvido no prazo" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Biblioteca" })
    ).not.toBeInTheDocument();
  });

  it("busca pela categoria sem considerar o Senso", async () => {
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={jest.fn()} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.type(search, "biblioteca");

    expect(screen.getByRole("option", { name: "Livro devolvido no prazo" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Organização dos materiais" })).not.toBeInTheDocument();
  });

  it("informa quando a busca não encontra nenhuma regra", async () => {
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={jest.fn()} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.type(search, "inexistente");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Nenhuma regra encontrada."
    );
  });

  it("seleciona a regra encontrada e fecha a lista", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={onChange} />);

    await user.click(screen.getByRole("combobox", { name: /buscar regra/i }));
    await user.click(
      screen.getByRole("option", { name: "Livro devolvido no prazo" })
    );

    expect(onChange).toHaveBeenCalledWith("2");
    expect(screen.getByRole("combobox", { name: /buscar regra/i })).toHaveValue(
      "Livro devolvido no prazo"
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("mantém o ícone da operação visível no campo após a seleção", () => {
    render(<RuleSelect rules={rules} selectedRuleId="2" onChange={jest.fn()} />);

    expect(
      screen.getByRole("img", { name: "Operação de subtração" })
    ).toBeInTheDocument();
  });

  it("permite navegar e selecionar pelo teclado", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="" onChange={onChange} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledWith("2");
    expect(search).toHaveValue("Livro devolvido no prazo");
  });

  it("limpa uma seleção anterior quando o usuário edita o texto", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="2" onChange={onChange} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.type(search, "x");

    expect(onChange).toHaveBeenCalledWith("");
  });

  it("fecha a lista com Escape sem alterar a seleção", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<RuleSelect rules={rules} selectedRuleId="2" onChange={onChange} />);

    const search = screen.getByRole("combobox", { name: /buscar regra/i });
    await user.click(search);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(search).toHaveValue("Livro devolvido no prazo");
    expect(onChange).not.toHaveBeenCalled();
  });
});
