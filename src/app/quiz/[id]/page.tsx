"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Mock function to simulate fetching a quiz from a database
const getQuiz = async (id: string) => {
  return {
    id,
    title: "Redux Basics",
    questions: [
      {
        id: 1,
        question: "What is Redux?",
        options: [
          "A state management library",
          "A routing library",
          "A styling framework",
          "A testing tool",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "What is an action in Redux?",
        options: [
          "A function that updates the state",
          "An object describing what happened",
          "A component that displays data",
          "A type of Redux store",
        ],
        correctAnswer: 1,
      },
    ],
  }
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useState(() => {
    getQuiz(params.id).then(setQuiz)
  }, [params.id])

  if (!quiz) {
    return <div>Loading...</div>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <h2 className="text-xl font-semibold">
                {index + 1}. {question.question}
              </h2>
              <RadioGroup
                onValueChange={(value) =>
                  handleAnswerChange(question.id, parseInt(value))
                }
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={optionIndex.toString()}
                      id={`q${question.id}-a${optionIndex}`}
                      disabled={submitted}
                    />
                    <Label htmlFor={`q${question.id}-a${optionIndex}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {submitted && (
                <p
                  className={
                    answers[question.id] === question.correctAnswer
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {answers[question.id] === question.correctAnswer
                    ? "Correct!"
                    : `Incorrect. The correct answer is: ${
                        question.options[question.correctAnswer]
                      }`}
                </p>
              )}
            </div>
          ))}
          {!submitted && <Button type="submit">Submit Quiz</Button>}
        </form>
      </main>
    </div>
  )
}

