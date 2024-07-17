import { cn } from "@/lib/utils";
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { AnswerType, QuizWithDetails } from "./use-quizz";

type QuizCardProps = {
  quizz: QuizWithDetails
  currentQuestion: number
  selectedAnswers: (number | null)[]
  isCorrectAnswers: boolean[]
  handleNextQuestion: () => void
  handlePreviousQuestion: () => void
  handleFinish: () => void
  handleSelectedAnswer: (answer: AnswerType, index: number) => void
}

export const QuizCard = ({
  quizz,
  currentQuestion,
  selectedAnswers,
  isCorrectAnswers,
  handleNextQuestion,
  handlePreviousQuestion,
  handleFinish,
  handleSelectedAnswer }: QuizCardProps) => {

  const quizzLength = quizz.questions.length
  const question = quizz.questions[currentQuestion].questionText
  const isDisabled = currentQuestion === 0;

  const answers = quizz.questions[currentQuestion].answers

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-6">
          <ProgressBar currentQuestion={currentQuestion + 1} qntQuizz={quizzLength} />
          <div className="flex flex-1 justify-center">
            <CardTitle className="leading-7">{question}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 w-full max-w-md gap-6">
          {answers.map((answer) => (
            <QuizzItems
              key={answer.id}
              answer={answer}
              currentQuestion={currentQuestion}
              selectedAnswers={selectedAnswers}
              isCorrectAnswers={isCorrectAnswers}
              handleSelectedAnswer={handleSelectedAnswer}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between md:justify-center gap-10">
        <QuestionNavigatorBtn
          title="Prev"
          onClick={handlePreviousQuestion}
          disabled={isDisabled}
          className="w-32"
        />
        {currentQuestion < quizzLength - 1 ? (
          <QuestionNavigatorBtn
            title="Next"
            onClick={handleNextQuestion}
            className="w-32"
          />
        ) : (
          <QuestionNavigatorBtn
            title="Show Result"
            onClick={handleFinish}
            className="w-32"
          />
        )}
      </CardFooter>
    </Card>
  )
}

function ProgressBar({ currentQuestion, qntQuizz }: { currentQuestion: number; qntQuizz: number }) {
  const radius = 50; // Радиус круга
  const circumference = 2 * Math.PI * radius; // Длина окружности
  const progress = (currentQuestion / qntQuizz) * circumference; // Длина заполненной части

  return (
    <div className="w-16 h-16 rounded-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="lightgray"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#03befc"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          className="transition-all duration-300 ease-in-out"
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dy="0.3em"
          className="text-[25px] font-medium text-black"
        >
          {currentQuestion}/{qntQuizz}
        </text>
      </svg>
    </div>
  );
}

type QuizzItemsProps = {
  answer: AnswerType
  currentQuestion: number
  selectedAnswers: (number | null)[]
  isCorrectAnswers: boolean[]
  handleSelectedAnswer: (answer: AnswerType, currentQuestion: number) => void
}

function QuizzItems({ answer, currentQuestion, selectedAnswers, isCorrectAnswers, handleSelectedAnswer }: QuizzItemsProps) {

  const isSelected = selectedAnswers[currentQuestion] === answer.id;
  const isCorrect = isSelected && isCorrectAnswers[currentQuestion];
  const isIncorrect = isSelected && !isCorrectAnswers[currentQuestion];

  const buttonClass = cn(
    isCorrect ? "border-green-600" : "",
    isIncorrect ? "bg-red-600" : ""
  );

  const spannClass = cn(
    "absolute inset-0 -z-10 rounded-lg border-b-4 border-solid border-transparent",
    isCorrect ? "bg-green-500" : "",
    isIncorrect ? "bg-red-500" : ""
  );

  return (
    <Button
      size="xl"
      variant="quizz"
      className={buttonClass}
      onClick={() => handleSelectedAnswer(answer, currentQuestion)}
      disabled={selectedAnswers[currentQuestion] !== null}
    >
      {answer.answerText}
      <span className={spannClass} />
    </Button>
  )
}

type QuestionNavigatorBtnProps = {
  title: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function QuestionNavigatorBtn({ title, disabled = false, className, onClick, ...props }: QuestionNavigatorBtnProps) {
  return (
    <Button
      variant="outline"
      size="navigation"
      onClick={onClick}
      className="relative border-b-4 border-black/50 transition-all duration-300 hover:border-black active:border-b-0 active:border-t-4 active:border-t-sky-500"
      disabled={disabled}
      {...props}
    >
      {title}
    </Button>
  )
}

