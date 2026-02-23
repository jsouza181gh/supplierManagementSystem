export function editUser() {
  return (
    <>
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-6">
            <div className="w-full max-w-md bg-gray-100 rounded-xl shadow-md p-8">

                <h2 className="text-center text-blue-900 text-xl font-semibold mb-6">
                Editar Usuário
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-5">
                <input
                    type="text"
                    placeholder="Nome"
                    className="w-full bg-gray-200 rounded-xl px-4 py-3 text-sm
                        shadow-inner focus:outline-none focus:ring-2
                        focus:ring-blue-800 transition"
                />

                <input
                    type="text"
                    placeholder="Sobrenome"
                    className="w-full bg-gray-200 rounded-xl px-4 py-3 text-sm
                        shadow-inner focus:outline-none focus:ring-2
                        focus:ring-blue-800 transition"
                />
                </div>

                <div className="mb-5">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-gray-200 rounded-xl px-4 py-3 text-sm
                        shadow-inner focus:outline-none focus:ring-2
                        focus:ring-blue-800 transition"
                />
                </div>

                <div className="mb-5">
                <input
                    type="password"
                    placeholder="Nova Senha"
                    className="w-full bg-gray-200 rounded-xl px-4 py-3 text-sm
                        shadow-inner focus:outline-none focus:ring-2
                        focus:ring-blue-800 transition"
                />
                </div>

                <div className="mb-6">
                <input
                    type="password"
                    placeholder="Confirmação de Senha"
                    className="w-full bg-gray-200 rounded-xl px-4 py-3 text-sm
                        shadow-inner focus:outline-none focus:ring-2
                        focus:ring-blue-800 transition"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800
                        text-white py-3 rounded-lg text-sm
                        font-medium transition"
                >
                Alterar Registro
                </button>

            </div>
        </div>
    </>
  )
}