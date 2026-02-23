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
  itemName: string
  category: string
  supplier: Supplier
}

export function ItemCard({
  itemName,
  category,
  supplier,
}: ItemCardProps) {

  return (
    <div className="w-72 bg-[var(--background-color)] rounded-lg shadow-md overflow-hidden">

      <div className="bg-[var(--primary-color)] text-white flex items-center justify-between px-4 py-2">
        <h2 className="font-semibold text-sm">
          {itemName}
        </h2>

        <img
          src={
            supplier.isPreferred
              ? "estrela_dourada.png"
              : "estrela_apagada.png"
          }
          alt="Favorito"
          className="w-5 h-5"
        />
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