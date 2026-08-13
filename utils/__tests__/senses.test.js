import { SENSE_ORDER, orderSenseNames } from "../senses";

describe("orderSenseNames", () => {
  it("aplica a ordem oficial independentemente da ordem da API", () => {
    expect(
      orderSenseNames([
        "Saúde",
        "Autodisciplina",
        "Utilização",
        "Limpeza",
        "Ordenação",
      ])
    ).toEqual(SENSE_ORDER);
  });

  it("mantém somente os sensos disponíveis na ordem oficial", () => {
    expect(orderSenseNames(["Saúde", "Utilização", "Limpeza"])).toEqual([
      "Utilização",
      "Limpeza",
      "Saúde",
    ]);
  });

  it("coloca valores desconhecidos depois dos sensos oficiais", () => {
    expect(orderSenseNames(["Sem Senso", "Saúde", "Experimental"])).toEqual([
      "Saúde",
      "Experimental",
      "Sem Senso",
    ]);
  });
});

