RC Fitness - E-commerce Full-Stack
Projeto de e-commerce completo desenvolvido como parte dos estudos em Análise e Desenvolvimento de Sistemas, com foco em criar uma aplicação robusta, segura e escalável, utilizando tecnologias modernas do ecossistema JavaScript/TypeScript.

🚀 Sobre o Projeto
O RC Fitness é uma plataforma de e-commerce totalmente funcional, construída com uma arquitetura de monorepo que separa o Frontend (React) e o Backend (Node.js). O projeto demonstra um ciclo de desenvolvimento completo, desde a modelagem do banco de dados e criação de uma API RESTful segura, até a construção de uma interface de utilizador reativa, responsiva e focada na experiência do utilizador (UI/UX).
O foco principal foi criar uma plataforma segura e profissional, implementando funcionalidades essenciais como um carrinho de compras persistente, painel administrativo para gerenciamento de conteúdo e um fluxo de autenticação avançado com dois fatores.

✨ Funcionalidades Implementadas
O projeto conta com um conjunto completo de funcionalidades padrão de um e-commerce moderno:
Autenticação e Segurança
Sistema de Autenticação Completo: Registo com validação de senha forte no backend e login seguro com bcrypt.
Gestão de Sessão com JWT: Utilização de Access Tokens (curta duração) e Refresh Tokens (longa duração) para manter o utilizador logado de forma segura.
Autenticação de Dois Fatores (2FA): Implementação de segurança de nível profissional com o padrão TOTP, permitindo que utilizadores protejam suas contas com apps como Google Authenticator.
Controle de Acesso (Roles): Divisão clara de permissões entre utilizadores CLIENT e ADMIN, com rotas e componentes protegidos.

Funcionalidades do E-commerce
CRUD de Produtos: Painel administrativo completo para administradores criarem, lerem, atualizarem e deletarem produtos.
Upload de Imagens: Suporte para upload de imagens de produtos, com armazenamento em cloud (Cloudinary) ou localmente.
Importação em Massa: Ferramenta de automação para administradores importarem milhares de produtos de uma só vez via ficheiro .csv, processado de forma eficiente com streams no backend.
Carrinho de Compras Persistente: O carrinho é salvo no banco de dados e associado a cada utilizador, mantendo os itens entre sessões.

🛠️ Tecnologias Utilizadas
Este projeto foi construído com as seguintes tecnologias:
Frontend
Backend
Banco de Dados
Ferramentas
React
Node.js
MySQL
Git & GitHub
TypeScript
Express.js
VS Code
Vite
Prisma (ORM)
Postman
Styled-Components
JWT
Axios
Bcrypt
React Router
Multer
React Toastify
OTPLib (para 2FA)
CSV-Parser
⚙️ Como Executar o Projeto
Para executar este projeto localmente, siga os passos abaixo.
Pré-requisitos
Node.js (versão 18 ou superior)
MySQL
Um gerenciador de pacotes como NPM ou Yarn
1. Clonar o Repositório
git clone [https://github.com/FelipeDeMayo/test1_ecommerce.git](https://github.com/FelipeDeMayo/test1_ecommerce.git)
cd test1_ecommerce
2. Configurar o Backend
# Navegue para a pasta do backend
cd backend
# Instale as dependências
npm install
# Crie um arquivo .env na raiz da pasta 'backend'
# e adicione as seguintes variáveis:
# DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/finalrc"
# JWT_SECRET="SEU_SEGREDO_JWT"
# REFRESH_TOKEN_SECRET="SEU_SEGREDO_REFRESH"
# Crie o banco de dados no seu MySQL
# (Você pode usar o MySQL Workbench ou a linha de comando)
# Aplique as migrações do Prisma para criar as tabelas
npx prisma migrate dev
# Inicie o servidor do backend
npm run dev
O servidor do backend estará rodando em http://localhost:3000.
3. Configurar o Frontend
# Em um novo terminal, navegue para a pasta do frontend
cd frontend
# Instale as dependências
npm install
# Inicie o servidor de desenvolvimento
npm run dev
A aplicação frontend estará acessível em http://localhost:5173.
👨‍💻 Autor
Felipe de Mayo
