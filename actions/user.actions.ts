"use server";

import db from "@/db/drizzle";
import { eq } from "drizzle-orm";

import * as schema from "@/db/schema"

type CreateUser = {
  userId: string
  fullName: string
  email: string
  userImage: string
}

export const createUser = async (userData: CreateUser) => {

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.userId, userData.userId),
      columns: {
        userId: true
      }
    })

    if (!existingUser?.userId) {
      await db.insert(schema.user).values({
        userId: userData.userId,
        fullName: userData.fullName,
        email: userData.email,
        userImage: userData.userImage,
      })
      console.log("User created successfully:", userData.userId);
    } else {
      console.log("User already exists:", userData.userId);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }

} 