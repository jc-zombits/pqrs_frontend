"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);

    try {
      // 1. Registrar el usuario
      const registerRes = await fetch("http://10.125.8.55:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });

      if (!registerRes.ok) {
        throw new Error(await registerRes.text());
      }

      // 2. Iniciar sesión automáticamente
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      });

      if (result?.ok) {
        router.push("/graficas");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="pt-13 flex items-center justify-center rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-2xl text-blue-600 font-bold mb-6 text-center">Registro</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Nombre</label>
          <input name="name" type="text" required className="w-full px-3 py-2 border text-gray-400 rounded-md" />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input name="email" type="email" required className="w-full px-3 py-2 border text-gray-400 rounded-md" />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">Contraseña</label>
          <input name="password" type="password" required className="w-full px-3 py-2 border text-gray-400 rounded-md" />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Registrarse
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-700">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-gray-700 hover:underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}