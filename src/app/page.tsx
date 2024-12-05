import { getQuizzesForUser } from "@/actions/actions";
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
import { Trash2 } from 'lucide-react'
import { QuizData } from "../../types/quiz";
import dayjs from "dayjs";
// This is a mock function to simulate fetching quizzes from a database
async function getQuizzes() {
  const quizzes = await getQuizzesForUser() as QuizData[];
  return quizzes;
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
                <TableCell>{dayjs(quiz.created_at).format('MM/DD/YYYY')}</TableCell>
                <TableCell>{quiz.status}</TableCell>
                <TableCell>
                    <Button variant="outline">
                      Take Quiz
                    </Button>
                    <Button size="icon" variant="outline" className="ml-2">
                      <Trash2 className="h-4 w-4" color="red"/>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  )
}

