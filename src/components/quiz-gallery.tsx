"use client"
import React, { useEffect, useState } from 'react'
import {Quiz} from './Quiz'
import { QuizProps } from '../../types/quiz'

const QuizGallery = ({id}: {id: string}) => {
    const [quizData, setQuizData] = useState<QuizProps | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const getQuiz = async () => {
            try {
                setIsLoading(true)
                console.log("Starting getQuiz with id:", id)
                const response = await fetch(`/api/quiz/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    next: { revalidate: 0 },
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
            } finally {
                setIsLoading(false)
            }
        }
        
        getQuiz()
    }, [id])

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[200px]">Loading quiz...</div>
    }

    return (
        <div><Quiz quizData={quizData} /></div>
    )
}

export default QuizGallery