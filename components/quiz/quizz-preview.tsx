import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type QuizzPreviewProps = {
  title: string;
  description: string;
  qntQuizz: number;
  handleStart: () => void;
};

export const QuizzPreview = ({ title, description, qntQuizz, handleStart }: QuizzPreviewProps) => {
  return (
    <Card className="max-w-3xl w-full min-h-[50vh] flex flex-col">
      <CardHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex justify-start md:justify-end">
            <p className="text-muted-foreground text-sm">
              You have{" "}
              <span className="text-black/85 font-medium">{qntQuizz}</span>{" "}
              questions
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow items-center justify-center">
        <Button size="xl" variant="quizzStart" onClick={handleStart}>
          Start Quizz
        </Button>
      </CardContent>
    </Card>
  );
}
