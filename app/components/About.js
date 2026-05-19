import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="relative w-full min-h-screen mt-6">
      {/* Background Image */}
      <Image
        src="/trophy.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        objectPosition="top"
        className="z-0"
        priority
      />

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>

      {/* Card with text */}
      <div
        id="about"
        className="absolute z-20 inset-x-0 -bottom-[280px] md:-bottom-[220px] flex justify-center"
      >
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h2 className="text-lg md:text-xl font-bold text-primary mb-4">
            E aí, queridos alunos do IFRN - Campus Lajes,
          </h2>
          <p className="text-sm md:text-base text-gray-800">
            O projeto <span className="italic">Com Amor, IF</span> convida vocês
            a participarem ativamente da construção de um campus mais
            organizado, acolhedor e colaborativo. Inspirado nos princípios do
            Programa 5S, o projeto valoriza atitudes que refletem cuidado com o
            ambiente, respeito ao próximo e responsabilidade coletiva.
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-800">
            Ao longo do ano letivo, as turmas poderão acumular pontos por meio
            de ações que demonstrem compromisso com esses valores, seja na
            organização dos espaços, na convivência, na iniciativa ou no
            engajamento em atividades propostas.
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-800">
            A pontuação é cumulativa e será acompanhada continuamente. Ao final
            do período, a turma com melhor desempenho será reconhecida com uma
            premiação especial, celebrando o esforço conjunto e o espírito de
            equipe.
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-800">
            Mais do que uma competição, o{" "}
            <span className="italic">Com Amor, IF</span> é uma oportunidade de
            desenvolver hábitos e atitudes que fazem a diferença dentro e fora
            do campus.
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-800">
            Contamos com vocês!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
