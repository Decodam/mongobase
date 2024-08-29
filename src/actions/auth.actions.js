"use server"
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "@auth/core/errors";


export async function logout(){
  await signOut();
}

export async function loginWithOAuth(provider, redirect) {
  await signIn(provider, { redirectTo: redirect ? redirect : "/" })
}

export async function createUserWithCredentials(fullname, email, password) {
  try {
    if(!fullname, !email, !password){
      throw new Error("Please provide fullname, email and password to continue")
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user and credential records
    const user = await prisma.user.create({
      data: {
        name: fullname,
        email,
        credentials: {
          create: {
            email,
            password: hashedPassword,
          },
        },
      },
    });

    
  } catch (error) {
    return {error: error.message || "Something went wrong"}
  }
  redirect("/login")
}


export async function loginWithCredentials(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Please provide email and password to continue");
    }

    await signIn("credentials", { email, password, redirect: false });

    
  } catch (error) {
    console.log({ error });

    if (error instanceof Error) {
      const type = error.type;
      const cause = error.cause;

      switch (type) {
        case "CredentialsSignin":
          return {error: "Invalid credentials."};
        case "CallbackRouteError":
          return {error: cause && cause.err ? cause.err.toString() : "Callback route error."};
        default:
          return {error: "Something went wrong. Please try again"};
      }
    }
  }
  redirect("/")
}