"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "../ui/use-toast";


export type QuizWithDetails = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  questions: {
    id: number;
    questionText: string;
    answers: {
      id: number;
      answerText: string;
      isCorrect: boolean;
    }[];
  }[];
};

export type AnswerType = {
  id: number;
  answerText: string;
  isCorrect: boolean;
};


export function useQuizz(quizz: QuizWithDetails) {
  const [start, setStart] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quizz.questions.length).fill(null));
  const [score, setScore] = useState<number>(0);
  const [finish, setFinish] = useState<boolean>(false);

  const handleNextQuestion = useCallback(() => {
    if (selectedAnswers[currentQuestion] !== null) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      toast({
        description: "Choose the correct answer",
      })
    }
  }, [currentQuestion, selectedAnswers]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const handleSelectedAnswer = (answer: AnswerType, index: number) => {
    setSelectedAnswers(prev => {
      const updatedAnswers = [...prev];
      updatedAnswers[index] = answer.id;
      return updatedAnswers;
    });

    if (answer.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleStartQuizz = () => {
    setStart(true);
  };

  const handleFinish = () => {
    setFinish(true);
  };

  const handleTryAgain = useCallback(() => {
    setStart(false);
    setSelectedAnswers(Array(quizz.questions.length).fill(null));
    setCurrentQuestion(0);
    setFinish(false);
    setScore(0);
  }, [quizz.questions.length]);

  const isCorrectAnswers = useMemo(() => {
    return selectedAnswers.map((id, index) => {
      const question = quizz.questions[index];
      const answer = question.answers.find(a => a.id === id);
      return answer ? answer.isCorrect : false;
    });
  }, [selectedAnswers, quizz.questions]);

  return {
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
    handleTryAgain
  };
}