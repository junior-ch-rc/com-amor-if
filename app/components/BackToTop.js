import { useEffect, useState } from "react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100); // aparece após 100px
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

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
