import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// This is a mock function to simulate fetching quizzes from a database

export default async function Dashboard() {
  const { userId } = auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div>
      <h1>Welcome to AI Quiz Generator</h1>
    </div>
  )
}

