"use client"
import React, { useEffect, useState } from 'react'
import {Quiz} from './Quiz'
import { QuizProps } from '../../types/quiz'
const QuizGallery = ({id}: {id: string}) => {
    const [quizData, setQuizData] = useState<QuizProps | null>(null)
    const getQuiz = async () => {
        try {
          console.log("Starting getQuiz with id:", id)
          
          // For server components in Next.js 14, we should use this pattern
          const response = await fetch(`/api/quiz/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            next: { revalidate: 0 }, // Instead of cache: 'no-store'
          })
          
          if (response.status === 404) {
            console.log("Quiz not found")
          }
      
          if (!response.ok) {
            throw new Error('Failed to fetch quiz')
          }
      
          const result = await response.json()
          console.log(result)
          setQuizData(result)
        } catch (error) {
          console.error("Error in getQuiz:", error)
          throw error
        }
      }
    useEffect(() => {
        getQuiz()
    }, [])
  return (
    <div>
        {quizData && <Quiz quizData={quizData} />}
    </div>
  )
}

export default QuizGallery