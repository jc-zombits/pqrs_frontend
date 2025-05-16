"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);

    const result = await signIn("credentials", {
      ...credentials,
      redirect: false
    });

    if (result?.error) {
      alert("Credenciales incorrectas");
    } else {
      router.push("/graficas");
    }
  };

  return (
    <div className="pt-10 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-2xl w-96 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Iniciar Sesión</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input name="email" type="email" required className="w-full px-3 py-2 border text-gray-700 rounded-md" />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">Contraseña</label>
          <input name="password" type="password" required className="w-full px-3 py-2 border text-gray-700 rounded-md" />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#107692] via-[#3b82f6] to-[#3129d3] text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
        >
          Ingresar con Email
        </button>
        
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full bg-gradient-to-r from-[#f50b0b] via-[#d66868] to-[#b92323] text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <span>Ingresar con Google</span>
          </button>
          
          <button
            type="button"
            onClick={() => signIn("github")}
            className="w-full bg-gradient-to-r from-[#0f172a]  to-[#3c4b61] text-white py-2 px-4 rounded-md hover:bg-gray-900 flex items-center justify-center gap-2"
          >
            <span>Ingresar con GitHub</span>
          </button>
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-700">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-white-400 hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}