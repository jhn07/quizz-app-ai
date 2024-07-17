
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link"
import AiButton from "./ui/btn-ai"
import { Button } from "./ui/button";


const TitleProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-5xl mx-auto h-[30vh] border-b-4 shadow-md rounded-lg mt-20 p-2">
      {children}
    </div>
  )
}

export const TitleMain = () => {
  return (
    <TitleProvider>
      <div className="h-full w-full flex flex-col items-center justify-center gap-2 group">
        <h2 className="text-2xl font-semibold">
          Generate Quizz with <span className="group-hover:text-3xl duration-300 font-bold transition-all">AI</span>
        </h2>
        <div className="flex items-center justify-center gap-6">
          <SignedOut>
            <Button className="w-32" asChild>
              <Link href="/sign-up">Create account</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <AiButton>
              <Link href="/generate">Generate quizz</Link>
            </AiButton>
          </SignedIn>
        </div>
      </div>
    </TitleProvider>
  )
}


