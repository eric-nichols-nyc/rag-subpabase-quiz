'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site-config"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, LogOut } from "lucide-react"
import { useClerk } from '@clerk/nextjs'
import { usePathname } from "next/navigation"

export function Header() {
  const { signOut } = useClerk()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-colors">
        {siteConfig.name}
      </Link>
      <nav>
        <ul className="flex space-x-4">
          {siteConfig.navigation.map((item) => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname === item.href ? "default" : "ghost"}
                className={`transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
                    : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
                }`}
              >
                <Link href={item.href}>{item.title}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => window.open('https://github.com/yourusername/rag-supabase-quiz', '_blank')}
          >
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => signOut({ redirectUrl: '/' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
