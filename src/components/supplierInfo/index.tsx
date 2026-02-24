"use client"

import { useEffect, useState } from "react"
import { UpdateSupplierForm } from "@/components/updateSupplierForm"

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
  const [isEditOpen, setIsEditOpen] = useState(false)

  const [isAddDocOpen, setIsAddDocOpen] = useState(false)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docCategory, setDocCategory] = useState("")
  const [uploading, setUploading] = useState(false)

  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [availableItems, setAvailableItems] = useState<SupplierItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState("")
  const [loadingItems, setLoadingItems] = useState(false)

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

  // 🔹 Buscar documentos
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

  async function handleDeleteSupplier() {
  const confirmDelete = window.confirm(
    "Tem certeza que deseja excluir este fornecedor?"
  )

  if (!confirmDelete) return

  try {
    const token = localStorage.getItem("token")

    const response = await fetch(
      `http://localhost:5000/suppliers/${supplier.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Erro ao excluir fornecedor")
    }

    onClose() // fecha modal principal
  } catch (error) {
    console.error(error)
    alert("Erro ao excluir fornecedor")
  }
}

async function handleDeleteItem(itemId: string) {
  const confirmDelete = window.confirm(
    "Deseja remover este item do fornecedor?"
  )
  if (!confirmDelete) return

  try {
    const token = localStorage.getItem("token")

    const payload = {
      name: supplier.name,
      cnpj: supplier.cnpj,
      location: supplier.location,
      representative: supplier.representative,
      phoneNumber: supplier.phoneNumber,
      email: supplier.email,
      site: supplier.site,
      description: supplier.description,
      isPreferred: supplier.isPreferred,
      itemIds: supplier.items
        .filter((item) => item.id !== itemId)
        .map((item) => item.id),
    }

    const response = await fetch(
      `http://localhost:5000/suppliers/${supplier.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error("Erro ao remover item")
    }

    // Atualiza UI localmente
    supplier.items = supplier.items.filter(
      (item) => item.id !== itemId
    )
  } catch (error) {
    console.error(error)
    alert("Erro ao remover item do fornecedor")
  }
}

async function handleDeleteDocument(documentId: string) {
  const confirmDelete = window.confirm(
    "Tem certeza que deseja excluir este documento?"
  )
  if (!confirmDelete) return

  try {
    const token = localStorage.getItem("token")

    const response = await fetch(
      `http://localhost:5000/documents/${documentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Erro ao excluir documento")
    }

    // Atualiza UI removendo o documento excluído
    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== documentId)
    )
  } catch (error) {
    console.error(error)
    alert("Erro ao excluir documento")
  }
}

async function handleUploadDocument() {
  if (!docFile || !docCategory) {
    alert("Selecione um arquivo e informe a categoria")
    return
  }

  try {
    setUploading(true)
    const token = localStorage.getItem("token")

    const formData = new FormData()

    formData.append("file", docFile)

    formData.append(
      "data",
      JSON.stringify({
        category: docCategory,
        supplierId: supplier.id,
      })
    )

    const response = await fetch("http://localhost:5000/documents/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Erro ao enviar documento")
    }

    const newDoc: SupplierDocument = await response.json()

    // Atualiza lista local
    setDocuments((prev) => [...prev, newDoc])

    // Reset
    setDocFile(null)
    setDocCategory("")
    setIsAddDocOpen(false)
  } catch (error) {
    console.error(error)
    alert("Erro ao fazer upload do documento")
  } finally {
    setUploading(false)
  }
}

async function fetchItems() {
  try {
    setLoadingItems(true)
    const token = localStorage.getItem("token")

    const response = await fetch(
      "http://localhost:5000/items/?limit=100",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Erro ao buscar itens")
    }

    const responseData = await response.json()

    // 🔴 resposta vem como [items, total]
    const items: SupplierItem[] = responseData[0] ?? []

    setAvailableItems(items)
  } catch (error) {
    console.error(error)
    alert("Erro ao carregar itens")
  } finally {
    setLoadingItems(false)
  }
}

async function handleAddItem() {
  if (!selectedItemId) {
    alert("Selecione um item")
    return
  }

  if (supplier.items.some((item) => item.id === selectedItemId)) {
    alert("Este item já está vinculado ao fornecedor")
    return
  }

  try {
    const token = localStorage.getItem("token")

    const payload = {
      name: supplier.name,
      cnpj: supplier.cnpj,
      location: supplier.location,
      representative: supplier.representative,
      phoneNumber: supplier.phoneNumber,
      email: supplier.email,
      site: supplier.site,
      description: supplier.description,
      isPreferred: supplier.isPreferred,
      itemIds: [
        ...supplier.items.map((item) => item.id),
        selectedItemId,
      ],
    }

    const response = await fetch(
      `http://localhost:5000/suppliers/${supplier.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      throw new Error("Erro ao adicionar item")
    }

    const addedItem = availableItems.find(
      (item) => item.id === selectedItemId
    )

    if (addedItem) {
      supplier.items.push(addedItem)
    }

    setSelectedItemId("")
    setIsAddItemOpen(false)
  } catch (error) {
    console.error(error)
    alert("Erro ao adicionar item")
  }
}

  return (
    <>
      {/* Modal Info */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg bg-gray-100 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">

              {/* Excluir */}
              <button
                onClick={handleDeleteSupplier}
                className="bg-blue-900 rounded-lg p-2 hover:bg-blue-800 transition cursor-pointer"
              >
                <img
                  src="icone_lixo.png"
                  alt="Excluir fornecedor"
                  className="h-4 w-4"
                />
              </button>

              {/* Editar */}
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="bg-blue-900 rounded-lg p-2 hover:bg-blue-800 transition cursor-pointer flex items-center justify-center"
              >
                <img
                  src="icone_editar.png"
                  alt="Editar fornecedor"
                  className="h-4 w-4"
                />
              </button>

            </div>

            {/* Título (centro) */}
            <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-blue-900">
              {supplier.name}
            </h2>

            {/* Botão Fechar (direita) */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-lg  cursor-pointer"
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

            {/* Descrição */}
            <div className="bg-gray-200 rounded-xl px-4 py-3 shadow-inner">
              <span className="text-gray-400 text-xs block">Descrição</span>
              {supplier.description ?? "-"}
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
                      className="flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2 shadow-inner"
                    >
                      <div className="font-medium text-gray-800 text-sm">
                        {item.category}: {item.item}
                      </div>

                      {/* Botão excluir item */}
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-blue-900 rounded-lg p-2 hover:bg-blue-800 transition cursor-pointer"
                      >
                        <img
                          src="icone_lixo.png"
                          alt="Excluir item"
                          className="h-3 w-3"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  Nenhum item cadastrado
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsAddItemOpen(true)
                  fetchItems()
                }}
                className="bg-blue-900 text-white text-xs px-3 py-2 my-4 rounded-lg hover:bg-blue-800 transition mt-2"
              >
                + Adicionar item
              </button>
            </div>

            {/* Documentos */}
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
                      className="flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2 text-xs"
                      title={doc.name}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src="icone_anexo.png"
                          alt="Documento"
                          className="w-4 h-4 shrink-0"
                        />
                        <span className="truncate">{doc.name}</span>
                      </div>

                      {/* Botão excluir documento */}
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="bg-blue-900 rounded-lg p-2 hover:bg-blue-800 transition cursor-pointer shrink-0"
                      >
                        <img
                          src="icone_lixo.png"
                          alt="Excluir documento"
                          className="h-3 w-3"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  Nenhum documento anexado
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsAddDocOpen(true)}
                className="bg-blue-900 text-white text-xs px-3 py-2 my-4 rounded-lg hover:bg-blue-800 transition mb-2"
              >
                + Adicionar documento
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <UpdateSupplierForm
          supplier={supplier}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      {isAddDocOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setIsAddDocOpen(false)}
        >
          <div
            className="bg-gray-100 rounded-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Adicionar documento
            </h3>

            {/* Categoria */}
            <input
              type="text"
              placeholder="Categoria do documento"
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 text-sm"
            />

            {/* Arquivo */}
            <label
            htmlFor="upload-doc"
            className="cursor-pointer bg-blue-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 inline-block mb-3"
            >
              Selecionar arquivo
            </label>
            <input
              type="file"
              id="upload-doc"
              onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddDocOpen(false)}
                className="text-sm px-3 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={handleUploadDocument}
                disabled={uploading}
                className="text-sm px-3 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {uploading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddItemOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setIsAddItemOpen(false)}
        >
          <div
            className="bg-gray-100 rounded-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Adicionar item
            </h3>

            {loadingItems ? (
              <p className="text-sm text-gray-400">Carregando itens...</p>
            ) : availableItems.length === 0 ? (
              <p className="text-sm text-gray-400">
                Nenhum item disponível
              </p>
            ) : (
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 text-sm"
              >
                <option value="">Selecione um item</option>

                {availableItems.map((item) => (
                  <option
                    key={item.id}          // key única e garantida
                    value={item.id}        // select sempre usa string
                  >
                    {(item.category ?? "Sem categoria")}: {item.name}
                  </option>
                ))}
              </select>
            )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddItemOpen(false)
                      setSelectedItemId("")   // 🔹 reset seguro
                    }}
                    className="text-sm px-3 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedItemId} // 🔹 evita submit inválido
                    className="text-sm px-3 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          )}
    </>
  )
}