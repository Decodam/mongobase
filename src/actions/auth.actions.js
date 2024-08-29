"use server"
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";


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
    const hashedPassword = await bcrypt.hash(password, 16);

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