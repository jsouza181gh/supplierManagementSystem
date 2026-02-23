import "./globals.css";

export const metadata = {
  title: 'Sistema Gerenciador Fornecedores - Geeco',
  description: 'Sistema para gerenciar fornecedores, incluindo cadastro, consulta e análise de dados.',
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-Br">
      <body>
        {children}
      </body>
    </html>
  );
}
