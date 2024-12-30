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
        className="absolute z-20 inset-x-0 -bottom-[80px] md:-bottom-[60px] flex justify-center"
      >
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h2 className="text-lg md:text-xl font-bold text-primary mb-4">
            E aí, queridos alunos do IFRN - Campus Lajes,
          </h2>
          <p className="text-sm md:text-base text-gray-800">
            As turmas que organizarem campanhas, registradas pelos líderes de
            turma junto à biblioteca (máximo de 1 por turma), de doação de
            livros de literatura, ou de material escolar, para escolas de suas
            cidades, receberão pontuação bônus de até 30 pontos.
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-800">
            Os alunos podem pontuar através de ações que demonstrem
            comprometimento com esses princípios. A pontuação é cumulativa e
            será monitorada ao longo do ano letivo. Ao final do ano, a turma com
            a maior pontuação receberá uma premiação especial, reconhecendo seu
            esforço e dedicação ao programa.
          </p>
          <p className="mt-4 text-sm md:text-base text-gray-800">
            Participem ativamente do &apos;Com Amor IF&apos; para contribuir com
            um ambiente mais organizado, saudável e produtivo, enquanto
            desenvolvem habilidades valiosas para o futuro! Juntos, podemos
            fazer a diferença em nosso campus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
