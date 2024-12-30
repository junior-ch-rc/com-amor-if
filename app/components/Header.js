"use client";

import React, { useState } from "react";

import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

const Header = ({ isLoggedIn, username }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header id="home" className="bg-primary text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">Com Amor, IF</div>

        {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} username={username} />

        {/* Mobile Navbar */}
        <MobileNavbar
          isLoggedIn={isLoggedIn}
          username={username}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
        />
      </div>
    </header>
  );
};

export default Header;
