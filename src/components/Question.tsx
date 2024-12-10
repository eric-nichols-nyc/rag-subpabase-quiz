import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from '../types/quiz'

interface QuestionProps {
  question: Question;
  onAnswerSelected: (answer: string) => void;
  userAnswer: string | null;
}

export function QuizQuestion({ 
  question, 
  onAnswerSelected, 
  userAnswer 
}: QuestionProps) {
  console.log('question', question);
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const shuffledOptions =  shuffleArray(question.options);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={userAnswer || ''} onValueChange={onAnswerSelected}>
          {shuffledOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

