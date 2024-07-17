import { getFreeQuizzes } from "@/actions/recive.action";
import { QuizzItems } from "@/components/quizz-items";
import { Title } from "@/components/title";
import { TitleMain } from "@/components/title-main";


export default async function Home() {
  const quizzes = await getFreeQuizzes()

  return (
    <div className="max-w-7xl mx-auto py-6 px-5 md:px-0">
      <TitleMain />
      {quizzes.length > 0 ? (
        <div className="mt-16 flex flex-col gap-4">
          <Title textBox="Free" text="Quizzes" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quizzes.map((quizz) => (
              <QuizzItems key={quizz.name} {...quizz} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
