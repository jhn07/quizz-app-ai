import { getquizz } from "@/actions/recive.action"
import { Quizz } from "@/components/Quizz"
import { notFound } from "next/navigation"

type CurrentPageQuizzProps = {
  params: {
    quizId: string
  }
}

export default async function CurrentPageQuizz({ params }: CurrentPageQuizzProps) {

  const quizz = await getquizz(parseInt(params.quizId))

  if (!quizz || !params.quizId) {
    return notFound()
  }

  return (
    <div className="h-screen flex flex-col">
      <Quizz quizz={quizz} />
    </div>
  )
}
