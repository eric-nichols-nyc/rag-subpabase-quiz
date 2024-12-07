import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from "../types/quiz"

interface ResultsProps {
  score: number
  totalQuestions: number
  onRestart: () => void
  questions: Question[]
  userAnswers: (string | null)[]
}

export function Results({ 
  score, 
  totalQuestions, 
  onRestart, 
  questions, 
  userAnswers 
}: ResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100)

  return (
    <div className="flex justify-center w-full">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center mb-8">
            You scored {score} out of {totalQuestions} ({percentage}%)
          </p>
          
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  userAnswers[index] === question.correct_answer
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <h3 className="font-semibold mb-2">{index + 1}. {question.question}</h3>
                <div className="ml-4 space-y-2">
                  <p>
                    <span className="font-medium">Your answer: </span>
                    {userAnswers[index]}
                  </p>
                  {userAnswers[index] !== question.correct_answer && (
                    <p className="text-green-700">
                      <span className="font-medium">Correct answer: </span>
                      {question.correct_answer}
                    </p>
                  )}
                  {question.explanation && (
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Explanation: </span>
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart}>Restart Quiz</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

