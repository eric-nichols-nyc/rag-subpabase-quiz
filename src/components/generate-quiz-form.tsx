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
import { toast } from "sonner"
import { Document } from "@prisma/client"

interface GenerateQuizFormProps {
  documents: Document[]
}

export function GenerateQuizForm({ documents }: GenerateQuizFormProps) {
  const [selectedDocument, setSelectedDocument] = useState("")
  const [subject, setSubject] = useState("")
  const [quizId, setQuizId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")

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
          subject,
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

  return (
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
        <div>
          <Label htmlFor="subject">Or enter a subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Redux"
            disabled
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || quizId !== null}
        >
          {isLoading ? "Generating Quiz..." : "Generate Quiz"}
        </Button>
      </form>

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