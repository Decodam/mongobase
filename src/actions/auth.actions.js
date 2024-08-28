"use server"

import { signIn, signOut } from "@/auth";
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function logout(){
  await signOut();
}


export async function loginWithOAuth(provider, redirect) {
  await signIn(provider, { redirectTo: redirect ? redirect : "/" })
}


export async function createUserWithEmailPassword(email, password, name) {
  if (!email || !password || !name) {
    return "Fullname, Email and password are required.";
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return "A user with this email already exists.";
  }

  
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  if (!newUser) {
    return "Error creating account! Please try again.";
  }

  redirect("/login")
}

export async function loginWithEmailPassword(email, password) {
  try {
    if (!email || !password) {
      return "Email and password are required";
    }
  
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: "/" 
    });
  
    if (!result) {
      return "Something went wrong";
    }

    revalidatePath("/", "layout")
  } catch (error) {
    return "Invalid login credentials";
  }
}