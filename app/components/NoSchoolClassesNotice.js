const NoSchoolClassesNotice = () => (
  <div
    className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900"
    role="status"
  >
    <p className="font-semibold">O ano letivo aberto ainda não possui turmas.</p>
    <p className="mt-1 text-sm">
      Os lançamentos ficam indisponíveis até que uma turma seja vinculada ao
      ano letivo atual.
    </p>
  </div>
);

export default NoSchoolClassesNotice;
