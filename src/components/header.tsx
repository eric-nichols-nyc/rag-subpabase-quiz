import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between p-6 bg-background border-b">
      <Link href="/" className="text-2xl font-bold">
        AI Quiz Generator
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Button asChild variant="ghost">
              <Link href="/">Dashboard</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost">
              <Link href="/upload">Upload</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost">
              <Link href="/generate">Generate Quiz</Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

