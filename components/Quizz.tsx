"use client";

import { useRouter } from "next/navigation";
import { QuizCard } from "./quiz/quiz-card";
import { QuizzPreview } from "./quiz/quizz-preview";
import { FinishQuizzView } from "./quiz/finish-preview";
import { QuizWithDetails, useQuizz } from "./quiz/use-quizz";


type QuizzProps = {
  quizz: QuizWithDetails;
};

export const Quizz = ({ quizz }: QuizzProps) => {

  const {
    start,
    currentQuestion,
    selectedAnswers,
    isCorrectAnswers,
    score,
    finish,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSelectedAnswer,
    handleStartQuizz,
    handleFinish,
    handleTryAgain,
  } = useQuizz(quizz)

  const router = useRouter()

  const handleGenerateNewQuizz = () => {
    router.push("/generate")
  }

  const inCorrectCount = quizz.questions.length - score

  return (
    <div className="flex flex-col gap-4 min-h-[100dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
      {start ? (
        <div className="max-w-6xl w-full h-full mx-auto rounded-md shadow-md">
          {finish ? (
            <FinishQuizzView
              score={score}
              inCorrectCount={inCorrectCount}
              handleTryAgain={handleTryAgain}
              handleGenerateNewQuizz={handleGenerateNewQuizz}
            />
          ) : (
            <QuizCard
              quizz={quizz}
              currentQuestion={currentQuestion}
              selectedAnswers={selectedAnswers}
              isCorrectAnswers={isCorrectAnswers}
              handleNextQuestion={handleNextQuestion}
              handlePreviousQuestion={handlePreviousQuestion}
              handleFinish={handleFinish}
              handleSelectedAnswer={handleSelectedAnswer}
            />
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <QuizzPreview
            title={quizz.name}
            description={quizz.description}
            qntQuizz={quizz.questions.length}
            handleStart={handleStartQuizz}
          />
        </div>
      )}
    </div>
  );
};
