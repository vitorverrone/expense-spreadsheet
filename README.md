# 📊 Expense Spreadsheet V3

Este é um monorepo gerenciado pelo [Turborepo](https://turbo.build/), contendo o ecossistema completo da aplicação de planilhas de gastos.

---

## 📂 Estrutura do Projeto

O projeto é dividido em três pacotes principais dentro da pasta `apps/`:

- **`apps/api`**: Backend robusto construído com **NestJS 11**, TypeORM e PostgreSQL.
- **`apps/client`**: Frontend moderno construído com **Next.js 16** (App Router), **React 19** e **Tailwind CSS 4**.
- **`apps/interfaces`**: Contratos e tipos TypeScript compartilhados entre o Frontend e o Backend.

---

## 🛠️ Tecnologias Principais

- **Monorepo**: Turborepo
- **Backend**: NestJS 11, TypeORM, JWT Auth, Class Validator
- **Frontend**: Next.js 16 (Server Components & Actions), React 19, Tailwind CSS 4, React Query
- **Banco de Dados**: PostgreSQL
- **Testes**: Playwright (E2E), Vitest (Client), Jest (API)

---

## 🚀 Como Começar

### 1. Instalar dependências
Na raiz do projeto, execute:
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Configure os arquivos `.env` na raiz e dentro de cada app (`apps/api` e `apps/client`). Utilize os arquivos `.env.example` como guia.

### 3. Rodar o projeto em desenvolvimento
Para iniciar o Client e a API simultaneamente com hot reload:
```bash
npm run dev
```

### 4. Build de produção
Para gerar a versão de produção de todos os apps:
```bash
npm run build
```

---

## 📜 Comandos Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia todos os apps em modo de desenvolvimento via Turbo. |
| `npm run build` | Compila todos os pacotes para produção. |
| `npm run e2e` | Executa os testes de ponta a ponta com Playwright. |
| `npm run test:ui` | Abre a interface de testes do Vitest no Client. |

---

> [!IMPORTANT]
> As interfaces em `apps/interfaces` garantem a consistência de tipos em todo o projeto. Sempre utilize as interfaces compartilhadas ao criar novos endpoints ou componentes.