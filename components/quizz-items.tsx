
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


type QuizzItems = {
  id: number;
  name: string;
  description: string;
}

export const QuizzItems = ({ id, name, description }: QuizzItems) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium line-clamp-2">{name}</CardTitle>
        <CardDescription className="line-clamp-1 text-[13.5px]">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-end">
        <Button asChild
          size="sm"
          className="w-16 hover:bg-gray-100"
          variant="link"
        >
          <Link href={`/quizz/${id}`}>Go</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
