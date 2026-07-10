# Address Challenge

Um monorepo full-stack para gerenciamento de endereços.

## 🚀 Tecnologias

- **Backend**: ASP.NET Core Web API (.NET 8), Entity Framework Core (SQL Server)
- **Frontend**: React, TypeScript, Vite, Chakra UI v2
- **Banco de Dados**: SQL Server (2022-latest)
- **Infraestrutura**: Docker & Docker Compose

## 📁 Estrutura do Projeto

- `/backend`: API em .NET 8.
- `/frontend`: Aplicação React usando Vite.
- `/scripts`: Scripts SQL puros (incluindo o script obrigatório de criação de tabelas).
- `docker-compose.yml`: Orquestração dos containers.

## ⚙️ Como executar com Docker (Recomendado)

1. Certifique-se de ter o Docker e Docker Compose instalados.
2. Na raiz do projeto, execute:
   ```bash
   docker-compose up --build
   ```
3. Acesso:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080/swagger`
   - SQL Server: Rodando na porta `1433` (Login: `sa` / Senha: `StrongPassword123!`)

## 🖥️ Como executar localmente (Sem Docker)

Se preferir rodar os projetos manualmente com um banco de dados SQL Server já instalado na sua máquina:

1. **Banco de Dados**:
   - Execute o script `/scripts/script_criacao_tabelas.sql` no seu SQL Server.
   - Atualize a string de conexão `DefaultConnection` no arquivo `/backend/appsettings.json` para apontar para o seu banco local.

2. **Backend**:
   - Entre na pasta `/backend`.
   - Restaure pacotes: `dotnet restore`
   - Execute: `dotnet run` (Geralmente roda na porta 5000/5001)

3. **Frontend**:
   - Entre na pasta `/frontend`.
   - Instale as dependências: `npm install`
   - Inicie o servidor: `npm run dev` (Roda na porta 5173)

---

## 📄 Scripts SQL

O requisito restrito de criar o script SQL puro contendo a tabela de `Usuarios` e `Enderecos` encontra-se no arquivo:
👉 **[scripts/script_criacao_tabelas.sql](scripts/script_criacao_tabelas.sql)**
