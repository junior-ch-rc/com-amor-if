import React from "react";

const BackToTop = () => {
  return (
    <a
      href="#home"
      className="z-50 fixed bottom-10 right-4 bg-white text-primary border border-gray-300 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
      aria-label="Voltar ao início"
    >
      ↑
    </a>
  );
};

export default BackToTop;
