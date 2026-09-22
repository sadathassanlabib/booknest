
// auth.js

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
        const { email, password } = credentials;

        if (!email || !password) {
          return null;
        }

        const userCollection = await dbConnect("users");

        const user = await userCollection.findOne({
          email: email.toLowerCase().trim(),
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        // Only approved users can login
        if (user.status !== "approved") {
          throw new Error(
            user.status === "pending"
              ? "Your account is pending admin approval."
              : "Your account has been rejected."
          );
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
          status: user.status,
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },

    async signIn({ user }) {
      return !!user;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/private`;
    },
  },
});
