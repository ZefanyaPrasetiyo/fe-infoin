import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    token: string;
    role: string;
    id_location: string;
    nama_panjang: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      id_location: string;
      nama_panjang: string;
    } & DefaultSession["user"];
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    role: string;
    id_location: string;
    nama_panjang: string;
  }
}