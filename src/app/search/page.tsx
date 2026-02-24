"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuthGuard } from "@/hooks/useAuthGuard"

import { Header } from "@/components/header"
import { ItemCard } from "@/components/itemCard"
import AIChatModal from "@/components/aiAssistant"
import UserModal from "@/components/userInfo"

interface Supplier {
  id: string
  name: string
  location: string
  email: string | null
  phoneNumber: string[]
  representative: string[]
  site: string | null
  isPreferred: boolean
}

export interface Item {
  id: string
  name: string
  category: string
  suppliers: Supplier[]
}

interface ItemSupplierCard {
  itemId: string
  itemName: string
  category: string
  supplier: Supplier
}

export default function SearchPage() {
  useAuthGuard()

  const searchParams = useSearchParams()
  const query = searchParams.get("q") ?? ""

  const [cards, setCards] = useState<ItemSupplierCard[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!query) {
      setCards([])
      setHasSearched(false)
      return
    }

    const fetchItems = async () => {
      setLoading(true)
      setHasSearched(true)

      try {
        const response = await fetch(
          `http://localhost:5000/items/?search=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!Array.isArray(data) || !Array.isArray(data[0])) {
          console.error("Formato inesperado da API:", data)
          setCards([])
          return
        }

        const itemsArray: Item[] = data[0]

        const flattened: ItemSupplierCard[] = itemsArray.flatMap(item =>
          item.suppliers.map(supplier => ({
            itemId: item.id,
            itemName: item.name,
            category: item.category,
            supplier,
          }))
        )

        setCards(flattened)
      } catch (error) {
        console.error("Erro ao buscar itens:", error)
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [query])

  return (
    <>
      <Header
        onOpenAI={() => setIsAIChatOpen(true)}
        onOpenUser={() => setIsUserModalOpen(true)}
        onOpenCreateItem={() => alert("Funcionalidade de criação de item ainda não implementada")}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary-color)]" />
          </div>
        )}

        {!loading && cards.length > 0 && (
          <div className="flex flex-wrap gap-6">
            {cards.map(card => (
              <ItemCard
                key={`${card.itemId}-${card.supplier.id}`}
                itemId={card.itemId}
                itemName={card.itemName}
                category={card.category}
                supplier={card.supplier}
              />
            ))}
          </div>
        )}

        {!loading && hasSearched && cards.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <p className="text-lg font-medium">
              Nenhum resultado encontrado
            </p>
            <p className="text-sm mt-2">
              Tente usar outros termos de busca.
            </p>
          </div>
        )}
      </main>

      {isAIChatOpen && (
        <AIChatModal
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
        />
      )}

      {isUserModalOpen && (
        <UserModal onClose={() => setIsUserModalOpen(false)} />
      )}
    </>
  )
}