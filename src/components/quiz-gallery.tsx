"use client"
import React, { useEffect, useState } from 'react'
import { Quiz } from './quiz'
import { QuizData } from '../types/quiz'
import { Loader2 } from "lucide-react"

const QuizGallery = ({id}: {id: string}) => {
    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        const getQuiz = async () => {
            try {
                setIsLoading(true)
                setError(null)
                
                const response = await fetch(`/api/quiz/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    next: { revalidate: 0 },
                })
                
                if (response.status === 404) {
                    setError("Quiz not found")
                    return
                }
            
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz')
                }
            
                const result = await response.json()
                setQuizData(result)
            } catch (error) {
                console.error("Error in getQuiz:", error)
                setError("Failed to load quiz. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }
        
        getQuiz()
    }, [id])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Loading quiz...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    return quizData ? (
        <div className="container mx-auto px-4 py-8">
            <Quiz quizData={quizData} />
        </div>
    ) : null
}

export default QuizGallery