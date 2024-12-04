"use client"

import { useState } from 'react'
import { QuizQuestion } from './Question'
import { Results } from './Results'
import { QuizProps } from '../../types/quiz'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function Quiz({ quizData }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
    }
    setIsAnswered(true)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setIsAnswered(false)
    } else {
      setShowResults(true)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setIsAnswered(false)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowResults(false)
  }

  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100

  if (showResults) {
    return <Results score={score} totalQuestions={quizData.questions.length} onRestart={restartQuiz} />
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
          onAnswer={handleAnswer}
        />
        <div className="flex justify-between mt-4">
          <Button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          <Button onClick={goToNextQuestion} disabled={!isAnswered}>
            {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}

