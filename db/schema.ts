import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Таблица пользователей
export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  fullName: text("full_name"),
  email: text("email").notNull(),
  userImage: text("user_image")
});

// Таблица викторин
export const quizz = pgTable("quizz", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  userId: text("user_id").references(() => user.userId, { onDelete: "cascade" }).notNull() // userId типа text ссылается на user.userId
});

// Таблица вопросов
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  quizzId: integer("quizz_id").references(() => quizz.id, { onDelete: "cascade" }).notNull()
});

// Таблица ответов
export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  answerText: text("answer_text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  questionId: integer("question_id").references(() => questions.id, { onDelete: "cascade" }).notNull()
});

// Определение отношений между таблицами
export const userRelations = relations(user, ({ many }) => ({
  quizzes: many(quizz)
}));

export const quizzRelations = relations(quizz, ({ one, many }) => ({
  user: one(user, {
    fields: [quizz.userId],
    references: [user.userId]
  }),
  questions: many(questions)
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quizz: one(quizz, {
    fields: [questions.quizzId],
    references: [quizz.id]
  }),
  answers: many(answers)
}));

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id]
  })
}));
