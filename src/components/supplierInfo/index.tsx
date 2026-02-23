"use client"

import { useEffect, useState } from "react"

interface SupplierItem {
  id: string
  item: string
  category: string
}

interface SupplierDocument {
  id: string
  name: string
  category: string
  path: string
  supplierId: string
}

interface SupplierDetails {
  id: string
  name: string
  cnpj: string
  email: string
  phoneNumber: string
  location: string
  representative: string | null
  site: string | null
  description: string | null
  isPreferred: boolean
  items: SupplierItem[]
}

interface SupplierInfoProps {
  supplier: SupplierDetails
  onClose: () => void
}

export function SupplierInfo({ supplier, onClose }: SupplierInfoProps) {
  const [documents, setDocuments] = useState<SupplierDocument[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  // ESC para fechar
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // 🔹 Busca documentos do fornecedor
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoadingDocs(true)
        const token = localStorage.getItem("token")
        const response = await fetch(
          `http://localhost:5000/documents/?supplierId=${supplier.id}`,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        )

        if (!response.ok) {
          throw new Error("Erro ao buscar documentos")
        }

        const data: SupplierDocument[] = await response.json()
        setDocuments(data)
      } catch (error) {
        console.error(error)
        setDocuments([])
      } finally {
        setLoadingDocs(false)
      }
    }

    fetchDocuments()
  }, [supplier.id])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-gray-100 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative mb-6">
          <h2 className="text-center text-xl font-semibold text-blue-900">
            {supplier.name}
          </h2>

          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm text-gray-700">
          {/* Dados */}
          <div className="bg-gray-200 rounded-xl px-4 py-3 shadow-inner">
            <span className="text-gray-400 text-xs block">Nº do CNPJ</span>
            {supplier.cnpj}
          </div>

          <div className="bg-gray-200 rounded-xl px-4 py-3 shadow-inner">
            <span className="text-gray-400 text-xs block">Email</span>
            {supplier.email}
          </div>

          {/* Itens */}
          <div>
            <span className="text-gray-400 text-xs block mb-2">
              Itens fornecidos
            </span>

            {supplier.items?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {supplier.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-200 rounded-lg px-3 py-2 shadow-inner"
                  >
                    <div className="font-medium text-gray-800 text-sm">
                      {item.category}: {item.item}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                Nenhum item cadastrado
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="bg-gray-200 rounded-xl px-4 py-3 shadow-inner">
            <span className="text-gray-400 text-xs block">Descrição</span>
            {supplier.description ?? "-"}
          </div>

          {/* 📎 Documentos anexados */}
          <div>
            <span className="text-gray-400 text-xs block mb-2">
              Documentos anexados
            </span>

            {loadingDocs ? (
              <div className="text-xs text-gray-400">
                Carregando documentos...
              </div>
            ) : documents.length > 0 ? (
              <div className="flex flex-col gap-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="relative flex-1 bg-gray-200 rounded-lg px-3 py-2 pr-10 text-xs truncate"
                    title={doc.name}
                  >
                    {doc.name}
                    <img
                      src="icone_anexo.png"
                      alt="Documento"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                Nenhum documento anexado
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}