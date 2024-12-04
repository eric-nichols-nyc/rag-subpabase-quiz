import { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from '../../types/quiz'
import { shuffleArray } from '../../utils/shuffleArray'

interface QuestionProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizQuestion({ question, onAnswer }: QuestionProps) {

  useEffect(() => {
    setShowExplanation(false)
    setSelectedAnswer(null)
  }, [question]) 

  
  console.log(question.options)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const shuffledOptions = shuffleArray(question.options)

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === question.correct_answer
      onAnswer(isCorrect)
      setShowExplanation(true)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer || ''} onValueChange={setSelectedAnswer}>
          {shuffledOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} disabled={showExplanation} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSubmit} disabled={!selectedAnswer || showExplanation}>
          Submit Answer
        </Button>
      </CardFooter>
      {showExplanation && (
        <CardContent>
          <p className={`mt-4 p-4 rounded-md ${selectedAnswer === question.correct_answer ? 'bg-green-100' : 'bg-red-100'}`}>
            {selectedAnswer === question.correct_answer ? 'Correct!' : 'Incorrect.'}
          </p>
          <p className="mt-2">{question.explanation}</p>
        </CardContent>
      )}
    </Card>
  )
}

