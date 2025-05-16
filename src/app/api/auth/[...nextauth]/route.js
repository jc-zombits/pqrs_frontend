import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    // Proveedor de credenciales (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
          });

          const user = await res.json();

          if (res.ok && user) {
            return user;
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      }
    }),
    
    // Proveedor de Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Opcional: parámetros adicionales de configuración
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // Proveedor de GitHub
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // Opcional: scope adicional
      authorization: {
        params: { scope: "read:user" }
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Si es un login con OAuth (Google/GitHub)
      if (account?.provider === "google" || account?.provider === "github") {
        // Puedes hacer una llamada a tu backend para registrar/validar el usuario
        try {
          const res = await fetch("http://localhost:5000/api/auth/oauth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: token.email,
              name: token.name,
              provider: account.provider,
              providerId: token.sub
            })
          });
          
          const userData = await res.json();
          if (res.ok) {
            token.id = userData.id;
          }
        } catch (error) {
          console.error("OAuth error:", error);
        }
      }
      
      // Si es un login con credenciales
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name
      };
      return session;
    },
    // Opcional: Redirigir después del login
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Opcional: Configuración de sesión
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };