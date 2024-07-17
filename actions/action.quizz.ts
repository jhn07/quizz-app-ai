"use server";

import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from "ai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { z } from "zod";

import db from '@/db/drizzle';
import { quizz as quizzModel, questions as questionModel, answers as answerModel } from "@/db/schema"
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

const quizzSchema = z.object({
  quizz: z.object({
    name: z.string().describe("The name of the quiz."),
    description: z.string().describe("The description of the quiz 5-7 words."),
    questions: z.array(z.object({
      questionText: z.string().describe("The text of the question being asked."),
      answers: z.array(
        z.object({
          answerText: z.string().describe("The text of the answer option."),
          isCorrect: z.boolean().describe("Indicates if the answer is correct or not.")
        }),
      ),
    })),
  }),
});

type QuizzSchemaType = z.infer<typeof quizzSchema>;
type QuizzQuestions = Omit<QuizzSchemaType["quizz"], "name" | "description">

export type InitialStateType = {
  status: "APPROVED" | "REJECTED" | undefined
  message: string | null
}

export const generateQuizz = async (prevState: any, formData: FormData) => {

  const user = await currentUser()

  if (!user || !user.id) {
    redirect("/sign-up")
  }

  const { file } = Object.fromEntries(formData.entries()) as { file: File | Blob }

  const pdfLoader = new PDFLoader(file, {
    parsedItemSeparator: ""
  })

  const docs = await pdfLoader.load()
  const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined)
  const texts = selectedDocuments.map((doc) => doc.pageContent)

  if (texts.length === 0) {
    return { status: "REJECTED", message: "Uploaded PDF is empty." };
  }

  // console.log("Generate Quizz")
  // console.log(texts)

  const moderationResult = await generateText({
    model: openai("gpt-4-turbo"),
    prompt: `Check the following text for inappropriate words or content not related to programming. Return "APPROVED" if the content is appropriate and related to programming, otherwise return "REJECTED". Text: ${texts}`,
    maxTokens: 10,
    temperature: 0,
  })

  if (moderationResult.text.trim() !== "APPROVED") {
    console.log("Content rejected: contains inappropriate words or not related to programming.");
    return { status: "REJECTED", message: "Content rejected: contains inappropriate words or not related to programming." } as InitialStateType
  }

  // console.log(moderationResult.text.trim())

  const { object } = await generateObject({
    model: openai('gpt-4-turbo'),
    schema: quizzSchema,
    prompt: `Based on the following content, generate a quiz with a unique name and description that fits the provided content. Ensure each question is unique, relevant to the content, and has multiple answers with one correct answer. The content is: ${texts}`,
  });

  const parseResult = quizzSchema.safeParse(object)

  if (!parseResult.success) {

    parseResult.error.issues.forEach((issue) => {
      console.error(`Path: ${issue.path.join(' -> ')}`);
      console.error(`Message: ${issue.message}`);
    });

    return { status: "REJECTED", message: "Invalid quiz data generated. Please try again." } as InitialStateType
  }

  const { quizz: parseQuizz } = parseResult.data;

  const uniqueQuestions = removeDuplicateQuestions({ questions: parseQuizz.questions })

  parseQuizz.questions = uniqueQuestions

  // console.log(JSON.stringify(parseQuizz, null, 2))

  const quizId = await saveQuizz(parseQuizz, user.id)

  redirect(`quizz/${quizId}`)
}

function removeDuplicateQuestions({ questions }: QuizzQuestions) {
  const seen = new Set()

  return questions.filter((question) => {
    const duplicate = seen.has(question.questionText)
    seen.add(question.questionText)

    return !duplicate
  })
}


async function saveQuizz(quizz: QuizzSchemaType["quizz"], userId: string) {
  try {
    const [quizzResult] = await db.insert(quizzModel)
      .values({
        userId: userId,
        name: quizz.name,
        description: quizz.description
      })
      .returning({ quizzId: quizzModel.id })

    const { quizzId } = quizzResult;

    for (const question of quizz.questions) {
      const [questionResult] = await db.insert(questionModel)
        .values({
          questionText: question.questionText,
          quizzId: quizzId
        })
        .returning({ questionId: questionModel.id })

      const { questionId } = questionResult;

      for (const answer of question.answers) {
        await db.insert(answerModel)
          .values({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
            questionId: questionId
          })
      }
    }

    return quizzId

  } catch (err) {
    console.log(console.error("Error saving to DB", err))
  }
}



