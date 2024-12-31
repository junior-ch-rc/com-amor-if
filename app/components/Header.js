"use client";

import { useState, useEffect } from "react";

import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "../providers/AuthProvider";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { user } = useAuth();

  return (
    <header id="home" className="bg-primary text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">Com Amor, IF</div>

        {/* Navbar */}
        <Navbar isLoggedIn={!!user?.username} username={user?.username || ""} />

        {/* Mobile Navbar */}
        <MobileNavbar
          isLoggedIn={!!user?.username}
          username={user?.username || ""}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
        />
      </div>
    </header>
  );
};

export default Header;
