import { Supplier } from "@/app/page"

interface SupplierCardProps {
  supplier: Supplier
  onClick: (id: string) => void
  onTogglePreferred: (updatedSupplier: Supplier) => void
}

export function SupplierCard({
  supplier,
  onClick,
  onTogglePreferred,
}: SupplierCardProps) {

  async function handleTogglePreferred(
    e: React.MouseEvent<HTMLImageElement>
  ) {
    e.stopPropagation()

    try {
      const token = localStorage.getItem("token")

      const updatedSupplier: Supplier = {
        ...supplier,
        isPreferred: !supplier.isPreferred,
      }

      const response = await fetch(
        `http://localhost:5000/suppliers/${supplier.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSupplier),
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao atualizar fornecedor")
      }

      onTogglePreferred(updatedSupplier)

    } catch (error) {
      console.error("Erro ao atualizar preferência:", error)
    }
  }

  return (
    <tr
      onClick={() => onClick(supplier.id)}
      className="bg-[var(--background-color)] text-[var(--text-color)] 
                 hover:bg-gray-100 transition cursor-pointer"
    >
      <td className="px-4 py-3 rounded-l-xl">
        {supplier.name}
      </td>

      <td className="px-4 py-3">
        {supplier.cnpj}
      </td>

      <td className="px-4 py-3">
        {supplier.location}
      </td>

      <td className="px-4 py-3">
        {supplier.representative ?? "-"}
      </td>

      <td className="px-4 py-3">
        {supplier.phoneNumber}
      </td>

      <td className="px-4 py-3">
        {supplier.email}
      </td>

      <td className="px-4 py-3">
        {supplier.site ? (
          <a
            href={supplier.site}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
            onClick={(e) => e.stopPropagation()}
          >
            {supplier.site}
          </a>
        ) : (
          "-"
        )}
      </td>

      <td className="px-4 py-3">
        {supplier.description ?? "-"}
      </td>

      <td className="px-4 py-3 text-center rounded-r-xl">
        <img
          src={
            supplier.isPreferred
              ? "estrela_dourada.png"
              : "estrela_apagada.png"
          }
          alt="Preferência"
          className="w-5 h-5 mx-auto cursor-pointer"
          onClick={handleTogglePreferred}
        />
      </td>
    </tr>
  )
}