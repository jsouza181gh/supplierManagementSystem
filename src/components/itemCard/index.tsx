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
    // aqui você pode:
    // - remover o item da lista
    // - ou dar refresh na página
  } catch (error) {
    console.error(error)
    alert("Erro ao excluir item")
  }
}
  return (
    <div className="w-72 bg-[var(--background-color)] rounded-lg shadow-md overflow-hidden">

      <div className="bg-[var(--primary-color)] text-white flex items-center justify-between px-4 py-2">
        <h2 className="font-semibold text-sm">
          {itemName}
        </h2>

        <div className="flex items-center gap-2">

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
  )
}