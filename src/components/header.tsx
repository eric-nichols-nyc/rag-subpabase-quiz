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
import { LogOut } from "lucide-react"
import { useClerk } from '@clerk/nextjs'
import { usePathname } from "next/navigation"

export function Header() {
  const { signOut } = useClerk()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-6 bg-background border-b">
      <Link href="/" className="text-2xl font-bold">
        {siteConfig.name}
      </Link>
      <nav>
        <ul className="flex space-x-4">
          {siteConfig.navigation.map((item) => (
            <li key={item.href}>
              <Button 
                asChild 
                variant={pathname === item.href ? "default" : "ghost"}
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