export const SENSE_ORDER = [
  "Utilização",
  "Ordenação",
  "Limpeza",
  "Saúde",
  "Autodisciplina",
];

const SENSE_POSITION = new Map(
  SENSE_ORDER.map((sense, position) => [sense, position])
);

export const orderSenseNames = (senseNames = []) =>
  [...senseNames].sort((first, second) => {
    const firstPosition = SENSE_POSITION.get(first);
    const secondPosition = SENSE_POSITION.get(second);
    const firstIsKnown = firstPosition !== undefined;
    const secondIsKnown = secondPosition !== undefined;

    if (firstIsKnown && secondIsKnown) return firstPosition - secondPosition;
    if (firstIsKnown) return -1;
    if (secondIsKnown) return 1;
    return first.localeCompare(second, "pt-BR");
  });

