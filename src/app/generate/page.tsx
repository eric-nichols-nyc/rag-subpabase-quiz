"use client"

import { useState } from "react"
import { Header } from "@/components/header"
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

// Mock function to simulate fetching documents from a database
const getDocuments = async () => {
  return [
    { id: 1, title: "Redux.pdf" },
    { id: 2, title: "React Hooks Article" },
    { id: 3, title: "NextJS 13 Website" },
  ]
}

export default function GenerateQuizPage() {
  const [documents, setDocuments] = useState([])
  const [selectedDocument, setSelectedDocument] = useState("")
  const [subject, setSubject] = useState("")

  useState(() => {
    getDocuments().then(setDocuments)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the request to generate a quiz
    console.log({ selectedDocument, subject })
    toast({
      title: "Quiz generated",
      description: "Your quiz has been successfully generated.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Generate Quiz</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="document">Select a document</Label>
            <Select onValueChange={setSelectedDocument}>
              <SelectTrigger>
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id.toString()}>
                    {doc.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subject">Or enter a subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Redux"
            />
          </div>
          <Button type="submit">Generate Quiz</Button>
        </form>
      </main>
    </div>
  )
}

