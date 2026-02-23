"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface HeaderProps {
  onOpenAI: () => void
  onOpenUser: () => void
}

export function Header({ onOpenAI, onOpenUser }: HeaderProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="bg-[var(--primary-color)] text-white px-3 md:px-6 py-3">
      <div className="flex items-center justify-between gap-3">

        <img
          src="user.png"
          alt="Ícone de usuário"
          className="h-6 sm:h-8 md:h-10 shrink-0 cursor-pointer"
          onClick={onOpenUser}
        />

        <div className="flex items-center flex-1 max-w-md gap-4">

          <Link href="/" className="shrink-0">
            <img src="home.png" alt="Home" className="h-6 md:h-8"/>
          </Link>

          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você está procurando hoje?"
              className="w-full pl-9 pr-3 py-2 rounded-md bg-[var(--background-color)] text-[var(--text-color)]"
            />

            <img
              src="lupa.png"
              alt="Buscar"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none"
            />
          </form>
        </div>

        <img
          src="ai_assistant.png"
          alt="Ícone IA"
          className="h-6 sm:h-8 md:h-10 shrink-0 cursor-pointer"
          onClick={onOpenAI}
        />

      </div>
    </header>
  )
}