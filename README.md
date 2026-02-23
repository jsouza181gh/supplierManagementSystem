Olá, seja bem vindo(a) à Supplier Managemente System da Geeco!

## Porque o usar essa stack?
    Typescript: Foi escolhido por já ser uma tecnologia que estava no meu interesse de aprender. Ela possui segurança de tipos (evitando muitos bugs), está crescente no mercado e possui forte comunidade;

    Next.js: Foi escolhida por ser uma alternativa ao React "puro", resolvendo o problema de SEO e adicionando o roteamento nativo;

    Tailwind: Foi escolhido pela facilida em aplicar estilos ao html, além de ser o padrão principal do Next.js;

    Groq: Foi escolhido por fornecer a opção de usar uma API gratuita, em que eu já possuia a chave de API.

## Dependências do Projeto

### Requisitos básicos

Para executar o projeto, é necessário ter instalado:

- **Node.js** (versão 18 ou superior — recomendado Node 20 LTS)

---

###  Dependências principais

As dependências abaixo são essenciais para o funcionamento da aplicação:

- **Next.js**  
  Framework utilizado para renderização, roteamento e build da aplicação.

- **React**  
  Biblioteca base para construção da interface do usuário.

- **React DOM**  
  Responsável pela renderização dos componentes React no navegador.

Sem essas dependências, a aplicação não consegue ser executada.

---

###  Dependências de desenvolvimento

Utilizadas durante o desenvolvimento e o processo de build do projeto:

- **TypeScript**  
  Adiciona tipagem estática, aumentando a segurança e a organização do código.

- **Tailwind CSS**  
  Framework utilitário para estilização da interface.

- **PostCSS**  
  Processador de CSS utilizado pelo Tailwind CSS.

- **Autoprefixer**  
  Garante compatibilidade do CSS com diferentes navegadores.

## Inicialização do Projeto

Antes de iniciar, certifique-se de ter o **Node.js** (versão 18 ou superior) instalado.

1. Esse projeto depende diretamente da API do repositório "[Repositório da API](https://github.com/jsouza181gh/supplierManagementSystemAPI)". Leia o readme.md da API e execute-a antes de seguir as próximas etapas.

2. Clone o repositório:
    No terminal da pasta desejada, execute "git clone https://github.com/jsouza181gh/supplierManagementSystem.git".

3. Acesse a pasta do projeto:
    Execute "cd supplierManagementSystem", para entrar na pasta do projeto.

4. Instale as dependências:
    E por fim execute "npm install".

5. Configure a chave de API do Groq no ".env.local":

    ![Configuração do .env.local](public/readmeImages/Configuracao%20.env.local.png)

6. Inicialização:
    Execute "npm run dev", para rodar o projeto.

7. Acessar o projeto:
    Em seu navegardor, acesse "[Link do Localhost](http://localhost:3000/)" para ser redirecionado à página de login.

8. Fazer registro:
    Clique ícone de registrar-se, conforme a imagem abaixo.

    ![Tela de Login](public/readmeImages/Tela%20de%20Login.png)

    Preecha os campos solicitados e clique em "Registrar-se" para criar um acesso à plataforma.

    ![Tela de Registro](public/readmeImages/Tela%20de%20Registro.png)

    Você será redirecionado para a tela principal do projeto, e após o carregamento verá a tela abaixo.

    ![Tela Principal](public/readmeImages/Tela%20Principal.png)

## Funções principais

1. Exibição dos principais fornecedores:
    Na tabela pricipal, é possivel ver todos os fornecedores paginadamente mostrando os prioritários primeiro, marcados por uma estrela amarela e marcar novos fornecedores para que sempre aparecem primeiro na busca.

    ![Tabela de Fornecedores](public/readmeImages/Tabela%20de%20Fornecedores.png)

2. Exibir informações do fornecedor:
    Ao clicar em cima de um fornecedor da tabela, se abrirá uma tela com suas informações, produtos/serviços fornecidos e documentos anexados a ele.

    ![Abrir Informações do Fornecedor](public/readmeImages/Abrir%20Informacoes%20Fornecedor.png)

    ![Informações do Fornecedor](public/readmeImages/Informacoes%20Fornecedor.png)


3. Cadastro de um novo fornecedor:
    Ao clicar no ícone de "mais", abrirá um formulário para inserção de informações, produtos, serviços e documentos de um novo fornecedor.

    ![Ícone de Novo Fornecedor](public/readmeImages/Icone%20Novo%20Fornecedor.png)

    ![Formulário de Novo Fornecedor](public/readmeImages/Formulário%20Cadastro%20de%20Fornecedor.png)

4. Busca de fornecedores por item/categoria:
    Usando a barra de pesquisa, é possível encontrar os fornecedores que destribuem aquele produto ou serviço.
    ![Busca por Item](public/readmeImages/Busca%20por%20Item.png)

    ![Busca por Categoria](public/readmeImages/Busca%20por%20Categoria.png)


5. Busca por fornecedores em linguagem natural:
    Ao clicar no ícone de "robô" no canto superior direito, abrirá um chat em que será possível buscar fornecedores da base de dados usando linguagem natural utilizando IA.

    ![Ícone de Assistente de IA](public/readmeImages/Icone%20Assistente%20de%20IA.png)

    ![Busca por IA](public/readmeImages/Chat%20Assistente%20de%20IA.png)


6. Verificar as informações do usuário:
    A clicar no ícone de "usuário" no canto superior direito, abrirá uma tela como suas informações.

    ![Ícone de Usuário](public/readmeImages/Icone%20de%20Usuario.png)

    ![Informações do Usuário](public/readmeImages/Informacoes%20Usuario.png)
    

### Organização do Projeto

1. Pasta "public":
    Na pasta "public" será possível encontrar os ícones utilizados para as telas e formulários desse projeto. E dentro da subpasta "readmeImages" é possível ver as imagens ilustrativas presente nesse README.md.

2. Pasta "scr":
    A pasta "scr" é onde encontrasse de fato as páginas componentes e o hook de autenticação em suas respectivas subpastas

    ## Subpasta "app":
        Diretamente dentro da pasta, temos os arquivos "globals.css" (Onde é importado o tailwind e definidos os estilos principais), "layout.tsx" (Onde é definida a estrutura base das outras páginas) e o "page.tsx" (Página principal da plataforma).

        Temos também subpastas que as outras páginas e rotas, como:
             /login - Página de login no arquivo "page.tsx";

             /register - Página de registro no arquivo "page.tsx";

             /search - Página de busca no arquivo "page.tsx";

             /api/ai - Conexão à API do Groq no arquivo "route.ts".
    
    ## Subpasta "components":
        Nessa sub pasta temos todos os componentes e modals utilizados nas páginas principais, como:
            /aiAssitant - Modal para chat com a IA, no arquivo "index.tsx";

            /createSupplierForm - Modal o formulário para cadastro de fornecedores, no arquivo "index.tsx";

            /formEditUser - Modal o formulário para edição do cadastro de usuáiro, no arquivo "index.tsx" (Ainda não implementado);

            /header - Componente com o cabeçalho das páginas, no arquivo "index.tsx";

            /itemCard - Componente com o modelo dos cards mostrados na página de search, no arquivo "index.tsx";

            /supplierCard - Componente com o modelo das linhas mostrados na tabela da página de principal, no arquivo "index.tsx";

            /supplierInfo - Modal com a tela que mostra as informações de um fornecedor, no arquivo "index.tsx";

            /updateSupplierForm - Modal com o formulário para a edição dos dados e anexos do fornecedor, no arquivo "index.tsx" (Ainda não implementado);

            /userInfo - Modal que exibe as informações do usuário, no arquivo "index.tsx".

    ## Subpasta "hooks":
        Nessa subpasta temos o arquivo "useAuthGuard.ts", nele fazemos uma chamada à nossa API para fazer a validação do token JWT. Caso não seja validado redireciona o usuário à tela de login.

3. Arquivo ".env.local":
    Nele está nossa chave de API do Groq, utilizada para chamadas de busca por IA.

4. Arquivo ".gitignore":
    Nele está toda a configuração para os arquivos que não serão versionados pelo git.

5. Arquivo "next.config.ts":
    Arquivo de configuração global do Next.js .

6. Arquivo "package-lock.json":
    Arquivo para definir as versões exatas de cada dependência do projeto.

7. Arquivo "package.json":
    Arquivo com scripts, dependências principais e informações do projeto.

8. Arquivo "postcss.config.mjs":
    Arquivo de configuração do postcss, utilizado pelo tailwind para conseguir processar o css.

9. Arquivo "tsconfig.json":
    Arquivo de configuração do typescript.