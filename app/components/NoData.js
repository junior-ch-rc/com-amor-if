import Link from "next/link";

const NoData = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
      <p className="mt-4 text-xl text-gray-800">
        Sem dados
      </p>
      <Link href="/">
        <p className="mt-6 inline-block px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark">
          Voltar para a página inicial
        </p>
      </Link>
    </div>
  );
};

export default NoData;
