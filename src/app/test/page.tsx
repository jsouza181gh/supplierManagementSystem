export default function updateSupplierForm() {
  return (
    <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-md bg-gray-100 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">

                <h2 className="text-center text-xl font-semibold text-blue-900 mb-6">
                Editar Fornecedor
                </h2>

                <form className="flex flex-col gap-4">

                <input
                    type="text"
                    placeholder="Nome Fantasia"
                    className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
                />

                <input
                    type="text"
                    placeholder="Nº do CNPJ"
                    className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
                />

                <div className="relative">
                    <input
                    type="text"
                    placeholder="Representante"
                    className="w-full rounded-xl bg-gray-200 px-4 py-3 pr-12 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
                    />
                    <img
                    src="icone_adicionar_azul.png"
                    alt="Adicionar"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                    />
                </div>

                <div className="relative">
                    <input
                    type="text"
                    placeholder="Telefone"
                    className="w-full rounded-xl bg-gray-200 px-4 py-3 pr-12 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
                    />
                    <img
                    src="icone_adicionar_azul.png"
                    alt="Adicionar"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <input
                    type="text"
                    placeholder="Item fornecido"
                    className="rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
                    />

                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Categoria do item"
                        className="w-full rounded-xl bg-gray-200 px-4 py-3 pr-12 text-sm outline-none shadow-inner focus:ring-2 focus:ring-blue-800"
                    />
                    <img
                        src="icone_adicionar_azul.png"
                        alt="Adicionar"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                    />
                    </div>

                </div>

                <textarea
                    placeholder="Descrição"
                    rows={3}
                    className="w-full rounded-xl bg-gray-200 px-4 py-3 text-sm outline-none shadow-inner resize-none focus:ring-2 focus:ring-blue-800"
                ></textarea>

                <button
                    type="submit"
                    className="w-full bg-blue-900 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition"
                >
                    Alterar Registro
                </button>

                <div className="flex items-center gap-2 mt-2">

                    <div className="flex-1 flex items-center justify-between bg-gray-200 rounded-lg px-3 py-2 text-xs text-[var(--text-color)]">

                    <span className="truncate">
                        Alvará de Potabilidade de Água.pdf
                    </span>

                    <img
                        src="icone_anexo.png"
                        alt="Anexo"
                        className="w-5 h-5 cursor-pointer"
                    />
                    </div>
                    
                    <button type="button" className="bg-blue-900 p-2 rounded-lg">
                    <img
                        src="icone_lixo.png"
                        alt="Excluir"
                        className="w-5 h-5"
                    />
                    </button>

                </div>

                <button
                    type="button"
                    className="w-full border border-gray-400 rounded-lg py-2 text-xs text-gray-600 hover:bg-gray-200 transition"
                >
                    Adicionar Documento
                </button>

                </form>
            </div>
        </div>
    </>
  )
}