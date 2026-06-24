import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/lib/auth"; 

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const data = await loginUser({
            email: credentials.email,
            password: credentials.password,
          });

   
          if (data && data.token) {
            return {
              id: data.user.id,
              name: data.user.nama_panjang,
              nama_panjang: data.user.nama_panjang,
              email: data.user.email,
              token: data.token,
              role: data.user.role,
              id_location: data.user.id_location
            };
          }
          
          return null;
        } catch (error) {
       
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.role = user.role;
        token.id_location = user.id_location;
        token.nama_panjang = user.nama_panjang;
        
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id_location = token.id_location;
      session.user.nama_panjang = token.nama_panjang;
      
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };