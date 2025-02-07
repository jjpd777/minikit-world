import NextAuth, { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "your-development-secret-here",

  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { 
        params: { 
          scope: "openid",
          response_type: "code",
        }
      },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      profile(profile) {
        console.log("[Debug] Raw profile:", profile);
        return {
          id: profile.sub,
          name: profile.sub,
        };
      },
      checks: ["pkce", "state"],
      profile(profile) {
        console.log("[Debug] Profile data:", profile);

        return {
          id: profile.sub,
          name: profile.sub,
          verificationLevel:
            profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("[Debug] Sign in attempt:", { user, account, profile });
      
      const verificationLevel = profile?.["https://id.worldcoin.org/v1"]?.verification_level;
      if (verificationLevel !== "orb") {
        console.log("[Debug] Rejecting non-orb verified user");
        return false;
      }
      
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("[Debug] Redirect:", { url, baseUrl });
      return url;
    },
  },
  events: {
    async error(error) {
      console.error("[Auth Error]", error);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
