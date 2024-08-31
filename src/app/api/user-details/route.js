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


// POST method to update user data
export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // Parse the request body to get the new name and image
    const { name, image } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name or image is required" }, { status: 400 });
    }

    // Update the user's name and/or image in the database
    const updatedUser = await prisma.user.update({
      where: {
        email: req.auth.user.email,
      },
      data: {
        ...(name && { name }), // Update name if provided
        ...(image && { image }), // Update image if provided
      },
    });

    return NextResponse.json({ message: "Your account has been updated successfully", data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
});