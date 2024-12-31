"use client";

import React from "react";

const Button = ({ label, onClick, color = "bg-blue-500", className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium text-white rounded ${color} hover:opacity-90 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
