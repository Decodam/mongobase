import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { prisma } from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"



export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        let email = credentials?.email
        let password = credentials?.password
          
        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        
        const result = await prisma.user.findUnique({
          where: { email },
          include: { credential: true },
        });

        if (!result) {
          throw new Error("User not found. Please check if you have password authentication enabled")
        }
    
        if (result && result.credential) {
          
          // Compare the provided password with the hashed password stored in the database
          const isPasswordValid = await compare(password, result.credential.password);
          
          if (isPasswordValid) {
            const { credential, ...cleanedUser } = result;
            user = cleanedUser;
          } else {
            throw new Error("Invalid login credentials")
          }
        } 

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  debug: true,
})