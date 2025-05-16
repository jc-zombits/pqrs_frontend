"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PerfilUsuario() {
  const { data: session, status } = useSession(); // Accedemos a la sesión
  const [user, setUser] = useState(null);

  // Cuando la sesión esté cargada, asignamos los datos al estado
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  if (status === "loading") {
    return <p>Cargando perfil...</p>;
  }

  if (!user) {
    return <p>No estás logueado</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow text-gray-600">
      <h1 className="text-2xl font-semibold mb-4">Perfil del Usuario</h1>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Imagen de Perfil:</strong> <img src={user.image} alt="Perfil" className="w-16 h-16 rounded-full" /></p>
      {/* Otros datos como estado, etc. */}
    </div>
  );
}
