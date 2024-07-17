"use server";

import db from "@/db/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";


type QuizWithDetails = {
  id: number;
  name: string
  description: string
  createdAt: string
  questions: {
    id: number;
    questionText: string
    answers: {
      id: number;
      answerText: string
      isCorrect: boolean
    }[];
  }[];
}

export const getquizz = async (quizzId: number) => {
  const [quizz] = await db.query.quizz.findMany({
    where: eq(schema.quizz.id, quizzId),
    with: {
      questions: {
        columns: {
          id: true,
          questionText: true
        },
        with: {
          answers: {
            columns: {
              id: true,
              answerText: true,
              isCorrect: true
            },
          },
        },
      },
    },
  });

  return quizz as QuizWithDetails
}


export const getFreeQuizzes = async () => {
  const quizzes = await db
    .select({
      id: schema.quizz.id,
      name: schema.quizz.name,
      description: schema.quizz.description
    })
    .from(schema.quizz)


  return quizzes
} 