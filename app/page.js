"use client"; // Necessário para garantir que esta página é executada no cliente

import dynamic from "next/dynamic";

// Carregando o componente principal da página dinamicamente com SSR desativado
const HomePage = dynamic(() => import("./HomePage"), { ssr: false });

export default function Page() {
  return <HomePage />;
}
