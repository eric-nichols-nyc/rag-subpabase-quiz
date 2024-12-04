import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function Results({ score, totalQuestions, onRestart }: ResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-center">
          You scored {score} out of {totalQuestions} ({percentage}%)
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onRestart}>Restart Quiz</Button>
      </CardFooter>
    </Card>
  )
}

