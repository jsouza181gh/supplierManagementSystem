"use client";

import { useEffect, useState } from "react"; 
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Header } from "@/components/header";
import { SupplierCard } from "@/components/supplierCard";
import { CreateSupplierForm } from "@/components/createSupplierForm";
import { SupplierInfo } from "@/components/supplierInfo";
import AIChatModal from "@/components/aiAssistant";
import UserModal from "@/components/userInfo";

interface Item {
  id: string;
  category: string;
  item: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  location: string;
  representative: string | null;
  phoneNumber: string;
  email: string;
  site: string | null;
  description: string;
  isPreferred: boolean;
  items: Item[];
}

type ApiResponse = [Supplier[], number];

export default function HomePage() {
  useAuthGuard();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const totalPages = Math.ceil(total / limit);

  async function handleSupplierClick(id: string) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/suppliers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setSelectedSupplier(data);
      setIsInfoOpen(true);
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
    }
  }

  useEffect(() => {
    async function fetchSuppliers() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/suppliers/?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: ApiResponse = await response.json();
      setSuppliers(data[0]);
      setTotal(data[1]);
    }

    fetchSuppliers();
  }, [page, limit]);

  return (
    <>
      <Header
        onOpenAI={() => setIsAIChatOpen(true)}
        onOpenUser={() => setIsUserModalOpen(true)}
      />

      <main>
        <img
          src="banner_principal.png"
          alt="Banner Principal"
          className="w-full h-auto"
        />

        <div className="w-full bg-gray-100 rounded-2xl shadow-md p-3">

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[var(--primary-color)] text-white text-sm rounded-xl">
                  <th className="px-4 py-3 text-left rounded-l-xl">Nome</th>
                  <th className="px-4 py-3 text-left">CNPJ</th>
                  <th className="px-4 py-3 text-left">Localização</th>
                  <th className="px-4 py-3 text-left">Representante</th>
                  <th className="px-4 py-3 text-left">Telefone</th>
                  <th className="px-4 py-3 text-left">E-mail</th>
                  <th className="px-4 py-3 text-left">Site</th>
                  <th className="px-4 py-3 text-left">Descrição</th>
                  <th className="px-4 py-3 text-center rounded-r-xl">
                    <img 
                      src="icone_adicionar_branco.png"
                      alt="Adicionar Novo Fornecedor"
                      className="w-6 h-6 mx-auto cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    />
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-700">
                {suppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onClick={handleSupplierClick}
                    onTogglePreferred={(updated) => {
                      setSuppliers((prev) =>
                        prev.map((s) =>
                          s.id === updated.id ? updated : s
                        )
                      );
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-3">
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value={3}>3 por página</option>
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
            </select>
          </div>

          <div className="flex justify-center items-center mt-4 space-x-2 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              ←
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-1 rounded-md transition
                    ${
                      page === pageNumber
                        ? "bg-[var(--primary-color)] text-white"
                        : "text-[var(--text-color)] hover:bg-gray-200"
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        {isModalOpen && (
          <CreateSupplierForm onClose={() => setIsModalOpen(false)} />
        )}

        {isInfoOpen && selectedSupplier && (
          <SupplierInfo
            supplier={selectedSupplier}
            onClose={() => setIsInfoOpen(false)}
          />
        )}

        {isAIChatOpen && (
          <AIChatModal
            isOpen={isAIChatOpen}
            onClose={() => setIsAIChatOpen(false)}
          />
        )}

        {isUserModalOpen && (
          <UserModal onClose={() => setIsUserModalOpen(false)} />
        )}
      </main>
    </>
  );
}