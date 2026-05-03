import { handlers } from "@/auth";

// Expose les routes GET et POST nécessaires à Auth.js
// → /api/auth/signin, /api/auth/signout, /api/auth/session, etc.
export const { GET, POST } = handlers;