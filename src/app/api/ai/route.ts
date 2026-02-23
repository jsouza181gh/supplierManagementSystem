import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { question, items } = await req.json()

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
            Você é um assistente especializado em recomendação de fornecedores.
            Seja profissional, humanizado e atencioso.
            Use os dados fornecidos para sugerir o melhor fornecedor.
            Trate os dados para que na aparecam listas, mas sim informações organizadas e fáceis de ler.
            `,
        },
        {
          role: "user",
          content: `
            Pergunta do usuário:
            ${question}

            Lista de itens disponíveis:
            ${JSON.stringify(items)}
            `,
        },
      ],
    }),
  })

  const data = await response.json()

  return NextResponse.json({
    answer: data.choices[0].message.content,
  })
}