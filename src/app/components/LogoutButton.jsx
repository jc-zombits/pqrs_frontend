"use client";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi"; // Importar icono

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
    >
      <FiLogOut className="text-base" />
      <span>Cerrar sesión</span>
    </button>
  );
}