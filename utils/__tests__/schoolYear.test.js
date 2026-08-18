import { getOpenSchoolYear } from "../schoolYear";

describe("getOpenSchoolYear", () => {
  it("retorna o ano marcado como aberto", () => {
    const years = [
      { id: 1, ano_letivo: 2023, status: "Fechado" },
      { id: 2, ano_letivo: 2024, status: "Aberto" },
    ];

    expect(getOpenSchoolYear(years)).toEqual(years[1]);
  });

  it("retorna null quando todos os anos estão fechados", () => {
    expect(
      getOpenSchoolYear([{ id: 1, ano_letivo: 2023, status: "Fechado" }])
    ).toBeNull();
  });
});
