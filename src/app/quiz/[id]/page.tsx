import { Header } from "@/components/header"
import QuizGallery from "@/components/quiz-gallery"
// Replace mock function with real API call


export default async function QuizPage({ params }: { params: { id: string } }) {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuizGallery id={params.id}/>
    </div>
  )
}

