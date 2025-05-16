// src/app/layout.js
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "PQRS Dashboard",
  description: "Panel de control de estadísticas PQRS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans bg-gray-50">
        <Providers>
          {/* Aquí dejamos que los children manejen la lógica del cliente */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
