import type { ArtistRole } from "@/types/auth";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      artistName: string;
      firstName: string;
      lastName: string;
      roles: ArtistRole[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    artistName: string;
    firstName: string;
    lastName: string;
    roles: ArtistRole[];
    sanctumToken: string;
  }
}