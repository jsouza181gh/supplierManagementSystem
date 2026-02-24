"use client";

import { useEffect, useState } from "react";

interface CreateItemFormProps {
  onClose: () => void;
}

interface ApiSupplier {
  id: string;
  name: string;
}

export function CreateItemForm({ onClose }: CreateItemFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [suppliers, setSuppliers] = useState<{ supplierId: string }[]>([
    { supplierId: "" },
  ]);

  const [supplierOptions, setSupplierOptions] = useState<ApiSupplier[]>([]);

  useEffect(() => {
    async function fetchSuppliers() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/suppliers/?limit=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      const suppliersFromApi: ApiSupplier[] = data[0];
      setSupplierOptions(suppliersFromApi);
    }

    fetchSuppliers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
      name,
      category,
      supplierIds: suppliers
        .filter((s) => s.supplierId !== "")
        .map((s) => s.supplierId),
    };

    const response = await fetch("http://localhost:5000/items/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("Erro ao cadastrar item");
      return;
    }

    alert("Item cadastrado com sucesso!");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-gray-100 rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
          Novo Item
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome do Item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          {suppliers.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
                <select
                value={entry.supplierId}
                onChange={(e) => {
                    const updated = [...suppliers];
                    updated[index].supplierId = e.target.value;
                    setSuppliers(updated);
                }}
                className="flex-1 rounded-xl bg-gray-200 px-4 py-3 text-[var(--text-color)] text-sm shadow-inner focus:ring-2 focus:ring-blue-800"
                >
                <option value="">Selecione o fornecedor</option>
                {supplierOptions.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                    </option>
                ))}
                </select>

                {index === suppliers.length - 1 && (
                <button
                    type="button"
                    onClick={() =>
                    setSuppliers([...suppliers, { supplierId: "" }])
                    }
                    className="w-12 h-12 flex items-center justify-center transition"
                >
                    <img
                    src="icone_adicionar_azul.png"
                    className="w-6 h-6 cursor-pointer"
                    alt="Adicionar fornecedor"
                    />
                </button>
                )}
            </div>
            ))}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}