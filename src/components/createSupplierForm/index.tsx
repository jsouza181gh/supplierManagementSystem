"use client";

import { useEffect, useState } from "react";

interface CreateSupplierFormProps {
  onClose: () => void;
}

interface ApiItem {
  id: string;
  name: string;
  category: string | null;
}

interface DocumentEntry {
  file: File;
  category: string;
}

export function CreateSupplierForm({ onClose }: CreateSupplierFormProps) {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [description, setDescription] = useState("");

  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");

  const [representatives, setRepresentatives] = useState<string[]>([""]);
  const [phones, setPhones] = useState<string[]>([""]);

  const [items, setItems] = useState<{ itemId: string; category: string }[]>([
    { itemId: "", category: "" },
  ]);

  const [itemOptions, setItemOptions] = useState<ApiItem[]>([]);
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);

  useEffect(() => {
    async function fetchItems() {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/items/?limit=100",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      const itemsFromApi: ApiItem[] = data[0];
      setItemOptions(itemsFromApi);
    }

    fetchItems();
  }, []);

  async function handleCepBlur() {
    if (cep.length < 8) return;

    const response = await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    );
    const data = await response.json();

    if (!data.erro) {
      const formatted = `${data.localidade} - ${data.uf}`;
      setAddress(formatted);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).map((file) => ({
      file,
      category: "",
    }));

    setDocuments((prev) => [...prev, ...files]);
  }

  function handleRemoveFile(index: number) {
    const updated = [...documents];
    updated.splice(index, 1);
    setDocuments(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const payload = {
      name,
      cnpj,
      location: address,
      representative: representatives.filter(Boolean).join(" / "),
      phoneNumber: phones.filter(Boolean).join(" / "),
      email,
      site,
      description,
      itemIds: items
        .filter((i) => i.itemId !== "")
        .map((i) => i.itemId),
    };

    const supplierResponse = await fetch(
      "http://localhost:5000/suppliers/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!supplierResponse.ok) {
      alert("Erro ao criar fornecedor");
      return;
    }

    const supplierData = await supplierResponse.json();
    const supplierId = supplierData.id;

    for (const doc of documents) {
      const formData = new FormData();
      formData.append("file", doc.file);
      formData.append(
        "data",
        JSON.stringify({
          category: doc.category,
          supplierId,
        })
      );

      await fetch("http://localhost:5000/documents/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }

    alert("Fornecedor cadastrado com sucesso!");
    onClose();
  }

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
          Novo Fornecedor
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome Fantasia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          <input
            type="text"
            placeholder="Nº do CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={handleCepBlur}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          <input
            type="text"
            placeholder="Endereço"
            value={address}
            readOnly
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          <input
            type="text"
            placeholder="Site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
          />

          {representatives.map((rep, index) => (
            <div key={index} className="relative">
              <input
                value={rep}
                onChange={(e) => {
                  const updated = [...representatives];
                  updated[index] = e.target.value;
                  setRepresentatives(updated);
                }}
                placeholder="Representante"
                className="w-full rounded-xl bg-gray-200 px-4 py-3 pr-12 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
              />

              {index === representatives.length - 1 && (
                <img
                  src="icone_adicionar_azul.png"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                  onClick={() =>
                    setRepresentatives([...representatives, ""])
                  }
                />
              )}
            </div>
          ))}

          {phones.map((phone, index) => (
            <div key={index} className="relative">
              <input
                value={phone}
                onChange={(e) => {
                  const updated = [...phones];
                  updated[index] = e.target.value;
                  setPhones(updated);
                }}
                placeholder="Telefone"
                className="w-full rounded-xl bg-gray-200 px-4 py-3 pr-12 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
              />

              {index === phones.length - 1 && (
                <img
                  src="icone_adicionar_azul.png"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                  onClick={() => setPhones([...phones, ""])}
                />
              )}
            </div>
          ))}

          {items.map((entry, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <select
                value={entry.itemId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedItem = itemOptions.find(
                    (item) => item.id === selectedId
                  );

                  const updated = [...items];
                  updated[index].itemId = selectedId;
                  updated[index].category =
                    selectedItem?.category || "";
                  setItems(updated);
                }}
                className="rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner focus:ring-2 focus:ring-blue-800"
              >
                <option value="">Selecione o item</option>
                {itemOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <input
                  value={entry.category}
                  readOnly
                  placeholder="Categoria"
                  className="w-full rounded-xl bg-gray-200 px-4 py-3 pr-12 text-sm shadow-inner"
                />

                {index === items.length - 1 && (
                  <img
                    src="icone_adicionar_azul.png"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                    onClick={() =>
                      setItems([
                        ...items,
                        { itemId: "", category: "" },
                      ])
                    }
                  />
                )}
              </div>
            </div>
          ))}

          <textarea
            placeholder="Descrição"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm shadow-inner resize-none focus:ring-2 focus:ring-blue-800"
          />

          <div className="flex flex-col gap-3 mt-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="relative flex-1 bg-gray-200 rounded-lg px-3 py-2 pr-10 text-xs truncate">
                  {doc.file.name}
                  <img
                    src="icone_anexo.png"
                    alt="Documento"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  />
                </div>

                <input
                  placeholder="Categoria"
                  value={doc.category}
                  onChange={(e) => {
                    const updated = [...documents];
                    updated[index].category = e.target.value;
                    setDocuments(updated);
                  }}
                  className="bg-gray-200 rounded-lg px-2 py-2 text-xs"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="bg-blue-900 p-2 rounded-lg"
                >
                  <img 
                      src="icone_lixo.png" 
                      alt="Remover Documento" 
                      className='w-5 h-5 mx-auto cursor-pointer' 
                    />
                </button>
              </div>
            ))}

            <label className="w-full border border-gray-400 rounded-lg py-2 text-xs text-gray-600 hover:bg-gray-200 transition text-center cursor-pointer">
              Adicionar Documento
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

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