import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Query user data along with associated accounts from Prisma
    const userData = await prisma.user.findUnique({
      where: {
        email: req.auth.user.email,
      },
      include: {
        accounts: true, // Include accounts in the response
      },
    });

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Filter only provider and type from accounts
    const filteredUserData = {
      ...userData,
      accounts: userData.accounts.map(account => ({
        provider: account.provider,
        type: account.type,
      })),
    };

    return NextResponse.json({ data: filteredUserData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});
