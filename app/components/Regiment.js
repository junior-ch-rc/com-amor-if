import React from "react";

const Regiment = () => {
  const handleDownload = () => {
    // Lógica para download do arquivo
    window.location.href = "/regulamento.pdf"; // Substitua pelo caminho correto do seu arquivo
  };

  return (
    <section
      id="regiment"
      className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-[140px] md:-mt-[-160px] mb-20 mb:mt-28"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">Regulamento</h2>
      <p className="text-sm md:text-base text-gray-800 mb-4">
        “Com Amor, IF” é focado em atitudes e princípios humanos, visando
        estimular a participação dos alunos na criação de um campus limpo,
        organizado, cooperativo e engajado. Baseado nos eixos do Programa 5S,
        adapta a proposta japonesa para o contexto local, incentivando a prática
        de conceitos e ferramentas que estruturam uma rotina mais organizada.
      </p>
      <p className="text-sm md:text-base text-gray-800 mb-4">
        O regulamento inclui a descrição detalhada dos cinco sensos (Utilização,
        Ordenação, Limpeza, Saúde e Autodisciplina), as normas para
        participação, e informações sobre a pontuação e premiação. Leia-o com
        atenção para aprender como ganhar vários bônus para a sua turma e como
        garantir o mega prêmio desta competição acadêmica!
      </p>
      <p className="text-sm md:text-base text-gray-800 mb-6">
        Baixe aqui o regulamento.
      </p>
      <button
        onClick={handleDownload}
        className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary-dark transition duration-300"
      >
        Baixar Regulamento
      </button>
    </section>
  );
};

export default Regiment;
