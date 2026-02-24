"use client"

import { useState } from "react"

interface SupplierItem {
  id: string
  item: string
  category: string
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

interface UpdateSupplierFormProps {
  supplier: SupplierDetails
  onClose: () => void
}

export function UpdateSupplierForm({
  supplier,
  onClose,
}: UpdateSupplierFormProps) {

  /* =======================
     Estados
  ======================= */

  const [name, setName] = useState(supplier.name)
  const [cnpj, setCnpj] = useState(supplier.cnpj)
  const [email, setEmail] = useState(supplier.email)
  const [site, setSite] = useState(supplier.site ?? "")
  const [description, setDescription] = useState(supplier.description ?? "")
  const [location, setLocation] = useState(supplier.location)
  const [isPreferred, setIsPreferred] = useState(supplier.isPreferred)

  const [representatives, setRepresentatives] = useState<string[]>(
    supplier.representative
      ? supplier.representative.split(" / ")
      : [""]
  )

  const [phones, setPhones] = useState<string[]>(
    supplier.phoneNumber
      ? supplier.phoneNumber.split(" / ")
      : [""]
  )

  const [itemIds, setItemIds] = useState<string[]>(
    supplier.items.map((i) => i.id)
  )

  const [loading, setLoading] = useState(false)

  /* =======================
     Submit
  ======================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const payload = {
        name,
        cnpj,
        location,
        representative: representatives.filter(Boolean).join(" / "),
        phoneNumber: phones.filter(Boolean).join(" / "),
        email,
        site,
        description,
        isPreferred,
        itemIds,
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
        throw new Error("Erro ao atualizar fornecedor")
      }

      alert("Fornecedor atualizado com sucesso!")
      onClose()
    } catch (error) {
      console.error(error)
      alert("Erro ao atualizar fornecedor")
    } finally {
      setLoading(false)
    }
  }

  /* =======================
     Render
  ======================= */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-gray-100 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
          Editar Fornecedor
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome Fantasia"
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          <input
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="Nº do CNPJ"
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          {representatives.map((rep, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={rep}
                onChange={(e) => {
                  const updated = [...representatives]
                  updated[index] = e.target.value
                  setRepresentatives(updated)
                }}
                placeholder="Representante"
                className="flex-1 rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner focus:ring-2 focus:ring-blue-800"
              />

              {index === representatives.length - 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setRepresentatives([...representatives, ""])
                  }
                  className="bg-gray-200 rounded-xl px-3"
                >
                  +
                </button>
              )}
            </div>
          ))}

          {phones.map((phone, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={phone}
                onChange={(e) => {
                  const updated = [...phones]
                  updated[index] = e.target.value
                  setPhones(updated)
                }}
                placeholder="Telefone"
                className="flex-1 rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner focus:ring-2 focus:ring-blue-800"
              />

              {index === phones.length - 1 && (
                <button
                  type="button"
                  onClick={() => setPhones([...phones, ""])}
                  className="bg-gray-200 rounded-xl px-3"
                >
                  +
                </button>
              )}
            </div>
          ))}

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
            rows={3}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner resize-none focus:ring-2 focus:ring-blue-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Alterar Registro"}
          </button>
        </form>
      </div>
    </div>
  )
}