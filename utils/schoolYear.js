export const getOpenSchoolYear = (schoolYears = []) =>
  schoolYears.find((schoolYear) => schoolYear.status === "Aberto") || null;

export const mergeSavedSchoolYear = (schoolYears, savedSchoolYear) => {
  const normalizedYears =
    savedSchoolYear.status === "Aberto"
      ? schoolYears.map((schoolYear) => ({
          ...schoolYear,
          status: "Fechado",
        }))
      : schoolYears;

  const savedYearExists = normalizedYears.some(
    (schoolYear) => schoolYear.id === savedSchoolYear.id
  );

  return savedYearExists
    ? normalizedYears.map((schoolYear) =>
        schoolYear.id === savedSchoolYear.id ? savedSchoolYear : schoolYear
      )
    : [...normalizedYears, savedSchoolYear];
};
