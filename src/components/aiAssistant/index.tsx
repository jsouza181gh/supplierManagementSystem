"use client"

import { useEffect, useState } from "react"

interface AIChatModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  async function handleSend() {
    if (!input.trim()) return

    const token = localStorage.getItem("token")

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const itemsResponse = await fetch(
        "http://localhost:5000/items/?limit=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const itemsData = await itemsResponse.json()

      const aiResponse = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.content,
          items: itemsData,
        }),
      })

      const aiData = await aiResponse.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: aiData.answer,
      }

      setMessages((prev) => [...prev, assistantMessage])

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Desculpe, ocorreu um erro ao buscar a melhor recomendação. Tente novamente.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] h-[550px] rounded-2xl shadow-2xl flex flex-col">

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg text-[var(--primary-color)] ">AI Supplier Assistant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl text-sm max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-500">
              Pensando...
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            placeholder="Qual item você procura hoje?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend()
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white px-4 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}