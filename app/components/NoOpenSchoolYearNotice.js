const NoOpenSchoolYearNotice = () => (
  <div
    className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900"
    role="status"
  >
    <p className="font-semibold">Não há ano letivo aberto.</p>
    <p className="mt-1 text-sm">
      As alterações de pontuação ficam indisponíveis até que um administrador
      abra um ano letivo.
    </p>
  </div>
);

export default NoOpenSchoolYearNotice;
