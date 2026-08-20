import { getOpenSchoolYear, mergeSavedSchoolYear } from "../schoolYear";

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

describe("mergeSavedSchoolYear", () => {
  it("fecha os demais anos imediatamente quando outro ano é aberto", () => {
    const years = [
      { id: 1, ano_letivo: 2023, status: "Aberto" },
      { id: 2, ano_letivo: 2024, status: "Fechado" },
    ];

    expect(
      mergeSavedSchoolYear(years, {
        id: 2,
        ano_letivo: 2024,
        status: "Aberto",
      })
    ).toEqual([
      { id: 1, ano_letivo: 2023, status: "Fechado" },
      { id: 2, ano_letivo: 2024, status: "Aberto" },
    ]);
  });

  it("permite manter todos os anos fechados", () => {
    const years = [{ id: 1, ano_letivo: 2023, status: "Aberto" }];

    expect(
      mergeSavedSchoolYear(years, {
        id: 1,
        ano_letivo: 2023,
        status: "Fechado",
      })
    ).toEqual([{ id: 1, ano_letivo: 2023, status: "Fechado" }]);
  });
});
