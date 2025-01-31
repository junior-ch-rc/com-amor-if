"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { getIFRNUrl } from "../../utils/getIFRNUrl";

const Navbar = ({ isLoggedIn, username }) => {
  const usernameShort = username?.split(" ")[0]; // Extrai o primeiro nome
  const pathname = usePathname();
  const from = pathname || "/profile";

  return (
    <nav className="hidden md:flex space-x-6">
      <Link
        href="/"
        className="hover:bg-primary-light px-4 py-2 rounded-lg transition duration-300 ease-in-out"
      >
        Home
      </Link>
      <Link
        href="/reports"
        className="hover:bg-primary-light px-4 py-2 rounded-lg transition duration-300 ease-in-out"
      >
        Relatórios
      </Link>
      <Link
        href="/#about"
        className="hover:bg-primary-light px-4 py-2 rounded-lg transition duration-300 ease-in-out"
      >
        Sobre
      </Link>
      <Link
        href="/#regiment"
        className="hover:bg-primary-light px-4 py-2 rounded-lg transition duration-300 ease-in-out"
      >
        Regulamento
      </Link>
      {isLoggedIn ? (
        <Dropdown username={usernameShort} />
      ) : (
        <a
          href={getIFRNUrl(from)}
          className="hover:bg-primary-light px-4 py-2 rounded-lg transition duration-300 ease-in-out"
        >
          Login
        </a>
      )}
    </nav>
  );
};

export default Navbar;
