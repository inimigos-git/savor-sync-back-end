# SavorSync

SavorSync é uma plataforma de gerenciamento de restaurantes que facilita a reserva de mesas para clientes e o gerenciamento de disponibilidade para restaurantes.

## Visão Geral

SavorSync oferece uma solução integrada para:
- Clientes: Reservar mesas em seus restaurantes favoritos
- Restaurantes: Gerenciar disponibilidade de mesas e reservas

O projeto está atualmente em fase de desenvolvimento.

## Tecnologias Utilizadas

### Backend (Em construção)
- Nest.js
- TypeScript
- Prisma (ORM)
- PostgreSQL (Banco de dados)
- bcrypt (Para hash de senhas)
- JWT (Para autenticação)

### Frontend (Planejado)
- React
- TypeScript
- Zod

## Estrutura do Projeto (Atualmente)

```
node_modules/
prisma/
    ├── migrations/
    ├── prisma.service.ts
    ├── schema.prisma
    └── seed.ts
src/
    ├── user/
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── update-user.dto.ts
    │   ├── entities/
    │   │   └── user.entity.ts
    │   ├── user.controller.ts
    │   ├── user.module.ts
    │   └── user.service.ts
    ├── app.controller.spec.ts
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    └── main.ts
test/
.env.example
.eslintrc.js
.gitignore
.prettierrc
nest-cli.json
package-lock.json
package.json
README.md
tsconfig.build.json
tsconfig.json
```

## Pré-requisitos

- Node.js
- npm ou yarn
- PostgreSQL

## Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/inimigos-git/savor-sync-back-end

# Entre no diretório
cd savor-sync-back-end

# Instale as dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Configure o Prisma
npx prisma generate

# Execute as migrações do banco de dados
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

Configuração do .env para Prisma

Crie um arquivo .env na raiz do projeto (você pode copiar o .env.example).
Adicione a seguinte variável de ambiente com a URL de conexão do seu banco de dados PostgreSQL:

Copy DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
Substitua johndoe, randompassword, localhost, 5432, e mydb com suas configurações específicas.

## Modelo de Dados

https://dbdiagram.io/d/DB-savor-66eeb42aa0828f8aa696d0f9

## API

[Documentação da API será adicionada conforme o desenvolvimento progride]

## Próximos Passos

- Desenvolvimento do frontend em React
- Implementação das principais funcionalidades de reserva
- Testes e otimização

## Contato

Equipe de Desenvolvimento:

- Nome: Edevando Alves
- LinkedIn: https://www.linkedin.com/in/edevando-alves/
- GitHub: @EdEddAEddy

Link do Projeto: https://github.com/EdEddAEddy/SavorSync
