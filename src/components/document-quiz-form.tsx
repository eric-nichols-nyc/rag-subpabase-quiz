"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Document } from "@prisma/client"

interface DocumentQuizFormProps {
  documents: Document[]
  onQuizGenerated: (quizId: string) => void
}

export function DocumentQuizForm({ documents, onQuizGenerated }: DocumentQuizFormProps) {
  const [selectedDocument, setSelectedDocument] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

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
          title: title.trim(),
        }),
      })

      if (!response.ok) throw new Error("Failed to generate quiz")
      const data = await response.json()
      
      if (data.quiz?.id) {
        onQuizGenerated(data.quiz.id)
        toast.success("Quiz generated successfully")
      } else {
        throw new Error("No quiz ID returned")
      }
    } catch (error) {
      console.error("Error generating quiz:", error)
      toast.error("Failed to generate quiz")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId)
    const selectedDoc = documents.find(doc => doc.id === documentId)
    if (selectedDoc) {
      setTitle(selectedDoc.title)
    }
  }

  return (
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
      <div className="flex gap-2">
      </div>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Generating Quiz..." : "Generate Document Quiz"}
      </Button>
    </form>
  )
} 