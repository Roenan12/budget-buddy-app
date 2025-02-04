//middleware in NextAuth/Auth.js
import { auth } from "@/lib/auth";
export const middleware = auth;

export const config = {
  matcher: ["/", "/dashboard"],
};
