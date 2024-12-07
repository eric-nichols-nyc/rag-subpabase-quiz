import { Header } from "@/components/header"
import QuizGallery from "@/components/quiz-gallery"

export default async function QuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <QuizGallery id={params.id}/>
      </main>
    </div>
  )
}