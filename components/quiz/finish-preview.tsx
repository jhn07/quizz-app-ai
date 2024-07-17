import { Button } from "../ui/button"

type FinishQuizzViewProps = {
  score: number
  inCorrectCount: number
  handleTryAgain: () => void
  handleGenerateNewQuizz: () => void
}

export const FinishQuizzView = ({ score, inCorrectCount, handleTryAgain, handleGenerateNewQuizz }: FinishQuizzViewProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm text-muted-foreground">You have correct answer: <span className="font-medium text-black/85">{score}</span></p>
        <p className="text-sm text-muted-foreground">You have incorrect answer: <span className="font-medium text-black/85">{inCorrectCount}</span></p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button size="sm" onClick={handleTryAgain}>Try Again</Button>
        <Button size="sm" onClick={handleGenerateNewQuizz}>Generate new Quizz</Button>
      </div>
    </div>
  )
}
