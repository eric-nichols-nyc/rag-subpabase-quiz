"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Document } from "@prisma/client"

interface GenerateQuizFormProps {
  documents: Document[]
}

export function GenerateQuizForm({ documents }: GenerateQuizFormProps) {
  const [selectedDocument, setSelectedDocument] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [quizId, setQuizId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState("MEDIUM")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // validate selectedDocument and title
    if (!selectedDocument) {
      toast.error("Please select a document")
      setIsLoading(false)
      return
    }

    if (!title.trim()) {
      toast.error("Please enter a quiz title")
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          documentId: selectedDocument, 
          subject: "",
          title: title.trim() 
        }),
      })

      if (!response.ok) throw new Error("Failed to generate quiz")
      const data = await response.json()
      
      // Store the quiz ID from the response
      if (data.quiz?.id) {
        setQuizId(data.quiz.id)
        toast.success("Quiz generated successfully")
      } else {
        throw new Error("No quiz ID returned")
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      toast.error("Failed to generate quiz")
      setQuizId(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Add handler to update title when document is selected
  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId)
    // Find the selected document and set its title as the quiz title
    const selectedDoc = documents.find(doc => doc.id === documentId)
    if (selectedDoc) {
      setTitle(selectedDoc.title)
    }
  }

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!selectedTopic) {
      toast.error("Please select a topic")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          topic: selectedTopic,
          title: `${selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)} Quiz`,
          numQuestions: 5,
          difficulty: "MEDIUM"
        }),
      })

      const data = await response.json()
      console.log('Quiz data:', data);

      if (!response.ok) {
        if (data.reason) {
          toast.error(data.reason)
        } else {
          toast.error(data.error || "Failed to generate quiz")
        }
        return
      }
      
      if (data.quiz?.id) {
        setQuizId(data.quiz.id)
        toast.success("Quiz generated successfully")
      } else {
        throw new Error("No quiz ID returned")
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      toast.error("Failed to generate quiz")
      setQuizId(null)
    } finally {
      setIsLoading(false)
    }
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="document">Select a document</Label>
                <Select onValueChange={handleDocumentSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Quiz Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              {/* add number input for number of questions */}
              <div className="flex gap-2">
                <div className="flex flex-col flex-1">
                  <Label htmlFor="numQuestions">Number of Questions</Label>
                  <Input
                    id="numQuestions"
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  placeholder="Enter number of questions"
                  required
                />
                </div>
                <div className="flex flex-col flex-1">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || quizId !== null}
                className="w-full"
              >
                {isLoading ? "Generating Quiz..." : "Generate Document Quiz"}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="topic" className="space-y-4 mt-4">
          <div className="space-y-6">
            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <div>
                <Label htmlFor="topic">Select a topic</Label>
                <Select onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="redux">Redux</SelectItem>
                    <SelectItem value="hooks">React Hooks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit"
                disabled={isLoading || quizId !== null}
                className="w-full"
              >
                Generate Topic Quiz
              </Button>
            </form>
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