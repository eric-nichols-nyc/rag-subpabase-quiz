"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface TopicQuizFormProps {
  onQuizGenerated: (quizId: string) => void
}

export function TopicQuizForm({ onQuizGenerated }: TopicQuizFormProps) {
  const [selectedTopic, setSelectedTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (!response.ok) {
        if (data.reason) {
          toast.error(data.reason)
        } else {
          toast.error(data.error || "Failed to generate quiz")
        }
        return
      }
      
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Generating Quiz..." : "Generate Topic Quiz"}
      </Button>
    </form>
  )
} 