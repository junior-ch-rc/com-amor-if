export const getOpenSchoolYear = (schoolYears = []) =>
  schoolYears.find((schoolYear) => schoolYear.status === "Aberto") || null;
