"use server"

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";


export async function logout(){
  await signOut();
  redirect("/login");
}

export async function loginWithOAuth(provider, redirect) {
  await signIn(provider, { redirectTo: redirect ? redirect : "/" })
}