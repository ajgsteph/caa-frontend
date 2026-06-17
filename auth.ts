import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authApi, ApiError } from "@/lib/api/auth.api";
import { loginSchema } from "@/lib/validations/auth.schema";
import { env } from "@/lib/env";
import type { SessionUser } from "@/types/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // ─── Providers ──────────────────────────────────────────────────────────────
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });
        if (!parsed.success) return null;

        let token: string;
        try {
          const loginResponse = await authApi.login(parsed.data);
          token = loginResponse.token;
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Erreur de connexion. Réessayez plus tard.";
          console.error("[Certifa][authorize] login failed:", message, error);
          throw new Error(message);
        }

        let profile: Awaited<ReturnType<typeof authApi.getProfile>>["data"];
        try {
          const profileResponse = await authApi.getProfile(token);
          profile = profileResponse.data;
        } catch (error) {
          console.error("[Certifa][authorize] getProfile failed:", error);
          profile = {
            id: 0,
            last_name: "",
            first_name: "",
            artist_name: "",
            email: parsed.data.email,
            phone: null,
            status: "ACTIVE",
            registered_at: new Date().toISOString(),
            roles: [],
          };
        }

        const user: SessionUser = {
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          artistName: profile.artist_name,
          roles: profile.roles,
          sanctumToken: token,
        };

        return user as unknown as Parameters<typeof Credentials>[0] extends {
          authorize: (...args: any[]) => infer R;
        }
          ? Awaited<R>
          : never;
      },
    }),
  ],

  // ─── Callbacks ──────────────────────────────────────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const sessionUser = user as unknown as SessionUser;
        token.id = sessionUser.id;
        token.email = sessionUser.email;
        token.firstName = sessionUser.firstName;
        token.lastName = sessionUser.lastName;
        token.artistName = sessionUser.artistName;
        token.roles = sessionUser.roles;
        token.sanctumToken = sessionUser.sanctumToken;
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        sanctumToken: token.sanctumToken as string,
        user: {
          id: token.id as number,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          artistName: token.artistName as string,
          roles: token.roles as SessionUser["roles"],
        },
      };
    },
  },

  // ─── Pages personnalisées ───────────────────────────────────────────────────
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  // ─── Secret validé (lib/env vérifie AUTH_SECRET ≥ 32 caractères) ────────────
  secret: env.AUTH_SECRET,

  // ─── Session ────────────────────────────────────────────────────────────────
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  },
});