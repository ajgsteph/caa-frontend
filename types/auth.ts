export type ArtistRole = "artist" | "admin" | "super_admin";

export interface ApiUser {
  id: number;
  last_name: string;
  first_name: string;
  artist_name: string;
  email: string;
  phone: string | null;
  status: "ACTIVE" | "INACTIVE";
  registered_at: string;
  roles: ArtistRole[];
}

export interface LoginApiResponse {
  data: Pick<ApiUser, "id" | "email" | "roles">;
  token: string;
}

export interface RegisterApiResponse {
  data: ApiUser;
  token: string;
}

// ─── Session Auth.js ─────────────────────────────────────────────────────────

export interface SessionUser {
  id: number;
  email: string;
  artistName: string;
  firstName: string;
  lastName: string;
  roles: ArtistRole[];
  sanctumToken: string;
}