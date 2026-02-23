"use client"

import { useEffect, useState } from "react"

interface UserModalProps {
  onClose: () => void
}

interface UserResponse {
  id: string
  name: string
  lastName: string
  email: string
  password: string
}

export default function UserModal({ onClose }: UserModalProps) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Token não encontrado")
      setLoading(false)
      return
    }

    fetch("http://localhost:5000/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar usuário")
        }
        return res.json()
      })
      .then((data: UserResponse) => {
        setUser(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-gray-100 rounded-xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative mb-6">
          <h2 className="text-center text-blue-900 text-xl font-semibold">
            Meu Usuário
          </h2>

          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {loading && (
          <p className="text-center text-gray-500 text-sm">
            Carregando dados...
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 text-sm">
            {error}
          </p>
        )}

        {user && (
          <>
            <div className="mb-5 bg-gray-200 rounded-xl px-4 py-3 shadow-inner">
              <p className="text-xs text-gray-500 mb-1">Nome completo</p>
              <p className="text-sm text-gray-800">
                {user.name} {user.lastName}
              </p>
            </div>

            <div className="mb-5 bg-gray-200 rounded-xl px-4 py-3 shadow-inner">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-800">{user.email}</p>
            </div>

            <div className="mb-2 bg-gray-200 rounded-xl px-4 py-3 shadow-inner">
              <p className="text-xs text-gray-500 mb-1">Senha</p>
              <p className="text-sm text-gray-800">••••••••</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}