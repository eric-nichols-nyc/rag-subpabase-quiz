"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Document } from "@prisma/client"
import { DocumentQuizForm } from "./document-quiz-form"
import { TopicQuizForm } from "./topic-quiz-form"
import { useRouter } from "next/navigation"

interface GenerateQuizFormProps {
  documents: Document[]
}

export function GenerateQuizTabs({ documents }: GenerateQuizFormProps) {
  const router = useRouter()
  const [quizId, setQuizId] = useState<string | null>(null)

  const handleQuizGenerated = (newQuizId: string) => {
    setQuizId(newQuizId)
    // redirect to the quiz page
    router.push(`/quiz/${newQuizId}`)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="document" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="document">Document Quiz</TabsTrigger>
          <TabsTrigger value="topic">Topic Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="document" className="space-y-4 mt-4">
          <div className="space-y-6">
            <DocumentQuizForm 
              documents={documents} 
              onQuizGenerated={handleQuizGenerated} 
            />
          </div>
        </TabsContent>

        <TabsContent value="topic" className="space-y-4 mt-4">
          <div className="space-y-6">
            <TopicQuizForm onQuizGenerated={handleQuizGenerated} />
          </div>
        </TabsContent>
      </Tabs>

      {quizId && (
        <div className="mt-4">
          <Link href={`/quiz/${quizId}`}>
            <Button variant="secondary" className="w-full">
              Take Quiz
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}