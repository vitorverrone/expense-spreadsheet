# 📊 Expense Spreadsheet V3

<p>Este é um monorepo gerenciado pelo <a href="https://turbo.build/">Turborepo</a>, contendo o ecossistema completo da aplicação de planilhas de gastos.</p>

<hr />

## 📂 Estrutura do Projeto

<ul>
  <li><strong>apps/api</strong>: Backend construído com NestJS.</li>
  <li><strong>apps/client</strong>: Frontend construído com Next.js.</li>
  <li><strong>apps/interfaces</strong>: Contratos e tipos compartilhados (TypeScript).</li>
  <li><strong>client-old</strong>: Backup da versão anterior do cliente.</li>
</ul>

<hr />

## 🛠️ Pré-requisitos

Antes de começar, você precisará ter instalado:
<ul>
  <li><strong>Node.js</strong> (Recomendado v18 ou superior)</li>
  <li><strong>npm / pnpm / yarn</strong></li>
</ul>

<hr />

## 🚀 Como começar

### 1. Instalar dependências
Na raiz do projeto, execute:
<pre><code>npm install</code></pre>

### 2. Configurar variáveis de ambiente
Certifique-se de configurar os arquivos <code>.env</code> tanto na raiz quanto dentro de cada app em <code>apps/</code>. Use os arquivos <code>.env.example</code> como base.

### 3. Rodar o projeto em desenvolvimento
Para subir o Client e a API simultaneamente em modo watch:
<pre><code>npx turbo dev</code></pre>

### 4. Build
Para gerar a versão de produção de todos os apps:
<pre><code>npx turbo build</code></pre>

<hr />

## 📜 Comandos Disponíveis (Turborepo)

<table>
  <thead>
    <tr>
      <th>Comando</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>dev</code></td>
      <td>Inicia todos os apps em modo de desenvolvimento (cache desativado).</td>
    </tr>
    <tr>
      <td><code>build</code></td>
      <td>Compila todos os apps para produção (outputs em <code>dist/</code>).</td>
    </tr>
  </tbody>
</table>

<br />

<blockquote>
  <strong>Nota:</strong> Como a pasta <code>apps/interfaces</code> contém definições globais, certifique-se de que os arquivos <code>bill.interface.ts</code> e <code>user.interface.ts</code> sejam importados corretamente nos demais serviços.
</blockquote>