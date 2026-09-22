import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const users = await dbConnect("users");

        const user = await users.findOne({
          email: email.toLowerCase().trim(),
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        if (user.status !== "approved") {
          throw new Error(
            user.status === "pending"
              ? "Your account is pending admin approval."
              : "Your account has been rejected."
          );
        }

        return {
          id: user._id.toString(),
          name: user.name || "",
          email: user.email || "",
          role: user.role || "user",
          status: user.status || "approved",
          image: user.image || "",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    /*
     * JWT
     */
    async jwt({ token, user, trigger, session }) {
      // Initial login
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
        token.picture = user.image || null;
      }

      /*
       * This runs when:
       *
       * useSession().update(...)
       *
       * is called from the client.
       */
      if (trigger === "update" && session) {
        if (session.name !== undefined) {
          token.name = session.name;
        }

        if (session.image !== undefined) {
          token.picture = session.image;
        }

        if (session.email !== undefined) {
          token.email = session.email;
        }

        if (session.role !== undefined) {
          token.role = session.role;
        }

        if (session.status !== undefined) {
          token.status = session.status;
        }
      }

      return token;
    },

    /*
     * Session
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;

        session.user.name = token.name;
        session.user.email = token.email;

        session.user.role = token.role;
        session.user.status = token.status;

        session.user.image = token.picture || null;
      }

      return session;
    },

    /*
     * Sign In
     */
    async signIn({ user }) {
      return !!user;
    },

    /*
     * Redirect
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/profile`;
    },
  },
});