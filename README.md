# Desafio AEC - Gerenciador de Endereços

Bem-vindo ao **Desafio AEC**, uma aplicação completa (Full-stack) projetada para realizar o gerenciamento de endereços de usuários, com autenticação segura e integração direta com a API do ViaCEP para preenchimento automático.

## 🚀 Objetivo do Projeto

Desenvolver uma aplicação web robusta utilizando C# (.NET 8) no backend e React (com TypeScript e Vite) no frontend. O sistema permite que um usuário realize seu cadastro, faça o login de forma segura via Token JWT e gerencie (CRUD) os seus endereços. Além disso, a aplicação é capaz de:
- Buscar e autocompletar dados a partir de um CEP usando o serviço do ViaCEP.
- Prover arquitetura multitenancy para isolar os dados baseados no usuário logado.
- Exportar todos os endereços salvos do usuário em formato **CSV**.

## 💻 Tecnologias Utilizadas

Este projeto foi construído utilizando:

### Backend
- **C# / .NET 8 (ASP.NET Core Web API)**
- **Entity Framework Core (EF Core)**
- **SQL Server** (banco de dados relacional)
- **BCrypt** (para hashing e segurança de senhas)
- **JWT (JSON Web Tokens)** (para autenticação)
- **IHttpClientFactory** (para requisições ao ViaCEP de forma segura e performática)

### Frontend
- **React 19**
- **Vite** (bundler ultra-rápido)
- **TypeScript**
- **Chakra UI v2** (para um design system bonito e reativo)
- **Axios** (com interceptors para injeção automática do Token)
- **React Hook Form** (para gestão avançada do formulário e validações)

### Infraestrutura
- **Docker & Docker Compose** (para orquestrar perfeitamente todo o ambiente)

---

## ⚠️ Requisito Crítico: Banco de Dados

Os scripts manuais para a criação inicial do banco de dados (Tabelas `Usuarios` e `Enderecos`) **encontram-se armazenados na pasta `/scripts/`** na raiz do projeto.

*Nota: O Backend possui configuração do `EnsureCreated` no Entity Framework Core para a construção e automação das tabelas ao subir a aplicação via Docker, facilitando o ambiente de desenvolvimento, porém os scripts nativos exigidos estão preservados intactos na pasta especificada.*

---

## ⚙️ Como Executar o Projeto

Você tem duas formas de rodar essa aplicação: utilizando o ambiente ultra automatizado do Docker ou rodando os serviços de forma autônoma na sua máquina local.

### Opção 1: O Jeito Fácil (Docker Compose) - Recomendado 🐋

Com o Docker Desktop ligado e rodando na sua máquina, abra o terminal na pasta raiz deste projeto e rode um único comando:

```bash
docker compose up --build -d
```

**O que vai acontecer?**
1. O Docker vai baixar uma imagem nativa do SQL Server, iniciar o banco e expor a porta `1433`.
2. Em seguida, vai compilar a API em .NET 8, conectar no banco, garantir a criação das tabelas e expor o Swagger na porta `8080`.
3. Por fim, vai compilar o código do Frontend em React (passando pelas camadas do Vite e Node), alocar as build static files num servidor NGINX hiper-leve e servir a aplicação na porta `5173`.

**Como acessar:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- API/Swagger: [http://localhost:8080/swagger](http://localhost:8080/swagger)


### Opção 2: O Jeito Manual 🛠️

Caso prefira rodar os serviços isolados na sua própria máquina local:

**1. Banco de Dados:**
- Certifique-se de possuir o SQL Server rodando localmente (na porta `1433`).
- Se necessário, altere a string de conexão no arquivo `backend/appsettings.json`.

**2. Backend (API):**
- Abra um terminal na pasta `backend`.
- Instale as dependências e rode a API:
```bash
cd backend
dotnet restore
dotnet run
```
A API iniciará no `http://localhost:8080`.

**3. Frontend (React):**
- Abra um terminal na pasta `frontend`.
- Baixe as dependências e rode o servidor de desenvolvimento do Vite:
```bash
cd frontend
npm install
npm run dev
```
O Frontend iniciará localmente (provavelmente no `http://localhost:5173`).

---

**Desenvolvido com carinho para o Desafio AEC.** 🏆
