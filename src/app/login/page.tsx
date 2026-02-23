"use client";

import Link from "next/link";
import { useState } from "react"; 
import { useRouter } from "next/navigation";

interface LoginResponse {
  accessToken: string;
}

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = {
      email: email,
      password: password,
    };

    const response = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      alert("Credenciais inválidas");
      return;
    }

    const data: LoginResponse = await response.json();

    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      router.push("/");
    }
  }

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center overflow-hidden">

      <img
        src="circulo_azul_superior.png"
        alt=""
        className="
          absolute
          top-0 left-0
          w-[25vw]
          min-w-[120px]
          max-w-[280px]
        "
      />

      <img
        src="circulo_azul_inferior.png"
        alt=""
        className="
          absolute
          bottom-0 right-0
          w-[25vw]
          min-w-[120px]
          max-w-[280px]
        "
      />

      <div className="relative w-full max-w-6xl flex items-center justify-center px-6">

        <div className="relative hidden md:block">

          <img
            src="fundo_login_registro.png"
            alt=""
            className=" h-[80vh] rounded-xl shadow-xl"
          />

          <div
            className="
              absolute
              top-1/2
              -translate-y-1/2
              -left-[20%]

              h-[80%]
              w-[80%]

              bg-white
              rounded-xl
              shadow-2xl
              p-6 sm:p-10
              flex flex-col
              justify-between
            "
          >

            <div className="flex justify-center">
              <img
                src="logo_geeco.png"
                alt="Logo Empresa"
                className="h-10 sm:h-12 md:h-14 object-contain"
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[12%] sm:gap-[15%] flex-1 justify-center">

              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" 
                  w-full
                  px-4 py-2 sm:py-3
                  text-sm sm:text-base
                  rounded-lg
                  border border-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-800
                "
              />

              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  px-4 py-2 sm:py-3
                  text-sm sm:text-base
                  rounded-lg
                  border border-gray-300
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-800
                "
              />

              <button
                type="submit"
                className="
                  w-full
                  py-2 sm:py-3
                  text-sm sm:text-base
                  bg-blue-900
                  text-white
                  rounded-lg
                  hover:bg-blue-800
                  transition
                  font-semibold
                "
              >
                Login
              </button>

            </form>

            <Link href="/register" className="shrink-0">
              <div className="flex justify-center items-center gap-2 text-blue-900 text-sm sm:text-base font-medium cursor-pointer hover:opacity-80 transition">
            
                <span>Registrar-se</span>
                <img
                  src="icone_cadastrar.png"
                  alt="Cadastrar"
                  className="h-4 sm:h-5 w-auto"
                />
                
              </div>
            </Link>

          </div>

          
        </div>

      </div>
    </div>
  )
}