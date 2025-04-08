import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get userHistory from request body
    const { userHistory } = await req.json();
    if (!userHistory) {
      return NextResponse.json({ error: "No history data provided" }, { status: 400 });
    }

    // Fetch existing user data from database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { historyTests: true },
    });

    // Ensure historyTests is an array, even if it's null
    const currentHistory = existingUser?.historyTests ?? [];

    // Merge with the new history
    const updatedHistory = [...currentHistory, ...userHistory];

    // Update the user's historyTests field
    await prisma.user.upsert({
      where: { id: userId },
      update: { historyTests: updatedHistory }, // No JSON.stringify needed
      create: { id: userId, historyTests: updatedHistory },
    });

    return NextResponse.json({ message: "History updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating history:", error);
    return NextResponse.json({ error: "Failed to update history" }, { status: 500 });
  }
}
