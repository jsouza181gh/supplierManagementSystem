"use client"

import { useState } from "react"

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

interface ItemCardProps {
  itemId: string
  itemName: string
  category: string
  supplier: Supplier
}

export function ItemCard({
  itemId,
  itemName,
  category,
  supplier,
}: ItemCardProps) {

  const [isEditOpen, setIsEditOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: itemName,
    category: category,
    supplierIds: [supplier.id],
  })

  /* =========================
     DELETE
  ========================== */
  async function handleDeleteItem() {
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir este item?"
    )

    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        `http://localhost:5000/items/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao excluir item")
      }

      alert("Item excluído com sucesso")
    } catch (error) {
      console.error(error)
      alert("Erro ao excluir item")
    }
  }

  /* =========================
     EDIT
  ========================== */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleUpdateItem() {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        `http://localhost:5000/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao atualizar item")
      }

      alert("Item atualizado com sucesso")
      setIsEditOpen(false)
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar item")
    }
  }

  return (
    <>
      {/* =========================
          CARD
      ========================== */}
      <div className="w-72 bg-[var(--background-color)] rounded-lg shadow-md overflow-hidden">

        <div className="bg-[var(--primary-color)] text-white flex items-center justify-between px-4 py-2">
          <h2 className="font-semibold text-sm">
            {itemName}
          </h2>

          <div className="flex items-center gap-2">

            {/* EDITAR */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-1 rounded-md transition cursor-pointer"
              title="Editar item"
            >
              <img
                src="icone_caneta_editar.png"
                alt="Editar item"
                className="w-4 h-4"
              />
            </button>

            {/* EXCLUIR */}
            <button
              onClick={handleDeleteItem}
              className="p-1 rounded-md transition cursor-pointer"
              title="Excluir item"
            >
              <img
                src="icone_lixo.png"
                alt="Excluir item"
                className="w-4 h-4"
              />
            </button>

          </div>
        </div>

        <div className="px-4 py-3 text-sm text-[var(--text-color)] space-y-2">

          <p className="font-medium">
            {category}
          </p>

          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{supplier.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>🏢</span>
            <span>{supplier.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>📧</span>
            <span>{supplier.email ?? "-"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>{supplier.phoneNumber[0] ?? "-"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span>{supplier.site ?? "-"}</span>
          </div>

        </div>
      </div>

      {/* =========================
          MODAL EDITAR
      ========================== */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg w-96 p-6 space-y-4">

            <h2 className="text-lg font-semibold">
              Editar Item
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Nome do item"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <input
                type="text"
                name="category"
                placeholder="Categoria"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdateItem}
                className="px-4 py-2 rounded bg-[var(--primary-color)] text-white"
              >
                Alterar registro
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}