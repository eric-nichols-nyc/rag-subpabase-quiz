"use client"

import { useState } from 'react'
import { QuizQuestion } from './Question'
import { Results } from './Results'
import { QuizProps } from '../types/quiz'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function Quiz({ quizData }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(
    new Array(quizData.questions.length).fill(null)
  )
  const [showResults, setShowResults] = useState(false)

  const handleAnswerSelected = (answer: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answer
    setUserAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setShowResults(true)
      }
    }, 300)
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === quizData.questions[index].correct_answer ? 1 : 0)
    }, 0)
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers(new Array(quizData.questions.length).fill(null))
    setShowResults(false)
  }

  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100

  if (showResults) {
    return    <Results 
    score={calculateScore()}
    totalQuestions={quizData.questions.length}
    onRestart={restartQuiz}
    questions={quizData.questions}
    userAnswers={userAnswers}
  />
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-center">{quizData.title}</h1>
    <p className="text-center">{quizData.description}</p>
    <Progress value={progress} className="w-full" />
    <p className="text-center">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
    <div className="space-y-4">
      <QuizQuestion
        question={quizData.questions[currentQuestionIndex]}
        onAnswerSelected={handleAnswerSelected}
        userAnswer={userAnswers[currentQuestionIndex]}
      />
      <div className="flex justify-start mt-4">
        <Button 
          onClick={goToPreviousQuestion} 
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous Question
        </Button>
      </div>
    </div>
  </div>
  )
}

