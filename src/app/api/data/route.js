import { auth } from "@/auth"
import { NextResponse } from "next/server"
 
export const GET = auth(function GET(req) {
  if (!req.auth) return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  
    return NextResponse.json({ data: "hello!", ...req.auth }, { status: 200 })
})