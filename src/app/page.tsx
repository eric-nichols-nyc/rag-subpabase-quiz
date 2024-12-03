import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Archive, Trash2 } from 'lucide-react'

// This is a mock function to simulate fetching quizzes from a database
async function getQuizzes() {
  return [
    { id: 1, title: "Redux Basics", createdAt: "2023-04-01", status: "Active" },
    { id: 2, title: "React Hooks", createdAt: "2023-04-02", status: "Archived" },
    { id: 3, title: "NextJS 13 Features", createdAt: "2023-04-03", status: "Active" },
  ]
}

export default async function Dashboard() {
  const quizzes = await getQuizzes()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Your Quizzes</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.createdAt}</TableCell>
                <TableCell>{quiz.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="outline">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}

