"use server"

import { signIn, signOut } from "@/auth";


export async function logout(){
  await signOut();
}

export async function loginWithOAuth(provider, redirect) {
  await signIn(provider, { redirectTo: redirect ? redirect : "/" })
}