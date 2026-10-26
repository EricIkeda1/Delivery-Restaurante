# EYI Food

Projeto pessoal de uma plataforma de delivery com React, TypeScript e Next.js. Inclui catálogo de restaurantes, personalização de pizzas, carrinho, pedidos, acompanhamento da entrega e painel do restaurante.

O banco é PostgreSQL no Neon. A busca de receitas, fotos e ingredientes usa a API TheMealDB. Pedidos e pagamentos são demonstrativos.

## Tecnologias

- React 19, TypeScript e Next.js com App Router
- CSS, Context API e hooks
- PostgreSQL no Neon, com consultas SQL parametrizadas
- Auth.js (NextAuth) com login pelo GitHub
- GitHub Actions para integração contínua

## Como executar

Use Node.js 22.13 ou superior, compatível com o arquivo `.nvmrc`.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

No Windows, copie `.env.example` para `.env.local` pelo explorador ou pelo editor. A aplicação abre em `http://localhost:3000`.

Para explorar as **23 telas sem configurar banco e login**, abra `http://localhost:3000/interfaces`. As páginas de demonstração ficam em `/previa/`. Nelas, carrinho, perfil e pedidos usam dados locais separados do Neon. A pesquisa de receitas ainda precisa de internet.

A home normal usa o Neon; configure as variáveis abaixo para usar o fluxo conectado.

## Banco de dados

Crie um banco no Neon e preencha `DATABASE_URL` em `.env.local`. Nunca use o prefixo `NEXT_PUBLIC_` para essa variável.

Execute os arquivos no SQL Editor do Neon, nesta ordem:

1. `database/schema.sql`
2. `database/seed.sql`
3. `database/api-food-seed.sql` (opcional, adiciona uma pizza de exemplo)

O arquivo `database/rename-forno.sql` serve apenas para instalações antigas que ainda têm o nome anterior do Forno da Vila. Não é necessário em um banco novo.

Não é preciso um ORM para este projeto: as consultas estão nos endpoints e usam o cliente HTTP do Neon.

## Login

Crie um OAuth App nas configurações de desenvolvedor do GitHub e configure:

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

Preencha `GITHUB_ID`, `GITHUB_SECRET` e `NEXTAUTH_URL` em `.env.local`. Gere um segredo para `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Defina `OWNER_GITHUB_ID` com o **ID numérico da sua conta no GitHub**, e não o nome de usuário. Ele pode ser consultado em `https://api.github.com/users/SEU_USUARIO`, no campo `id`.

O painel `/restaurante` só aceita essa conta autenticada. Se o ID não estiver configurado, o acesso administrativo fica bloqueado. Os outros usuários acessam apenas os próprios pedidos e perfil. A sessão usa cookies gerenciados pelo Auth.js; cabeçalhos enviados pelo navegador não autenticam usuários.

Depois de entrar, preencha nome e telefone em `/cadastro` ou `/perfil`. A recuperação da conta acontece no GitHub.

## Organização dos arquivos

| Pasta               | Responsabilidade                                                        |
| ------------------- | ----------------------------------------------------------------------- |
| `src/app`           | Rotas, layouts e endpoints da API                                       |
| `src/views`         | Conteúdo das páginas, separado das rotas                                |
| `src/components`    | Componentes separados por área: layout, restaurante, pedidos e carrinho |
| `src/contexts`      | Carrinho e estado do menu                                               |
| `src/hooks`         | Hooks compartilhados                                                    |
| `src/services`      | Requisições HTTP e adaptador da demonstração                            |
| `src/lib`           | Banco, autenticação, validação e funções auxiliares                     |
| `src/types`         | Tipos usados em mais de uma parte do projeto                            |
| `src/styles`        | Estilos e tema de cores                                                 |
| `public/assets`     | Imagens e logo                                                          |
| `database`          | Criação das tabelas e dados iniciais                                    |
| `tests`             | Testes das regras de negócio e navegação                                |
| `.github/workflows` | Validação automática no GitHub Actions                                  |

Componentes e páginas usam PascalCase, como `RestaurantCard.tsx`. Hooks começam com `use`, como `useAsync.ts`. Arquivos auxiliares usam nomes descritivos. Os nomes `page.tsx`, `layout.tsx` e `route.ts` seguem as convenções do Next.js.

## Comandos

```bash
npm run dev        # Desenvolvimento
npm run typecheck  # Verificação de tipos
npm test           # Testes automatizados
npm run lint       # Análise do código
npm run build      # Build de produção
npm start          # Executar o build
npm run format     # Formatação com Prettier
```

## CI/CD

O arquivo `.github/workflows/ci.yml` instala as dependências com o lockfile, verifica os tipos, analisa o código, executa os testes e gera o build em pushes e pull requests para `main`. Ele não precisa de credenciais do banco ou do GitHub OAuth. Testes e build não executam migrations nem alteram o Neon.

Para deploy contínuo, importe o repositório na Vercel e selecione o framework Next.js. Use os comandos padrão: `npm ci` e `npm run build`.

Cadastre as variáveis de `.env.example` no ambiente de produção da Vercel. Troque `NEXTAUTH_URL` pela URL final e cadastre essa mesma URL no OAuth App do GitHub, com callback `/api/auth/callback/github`. Prefira OAuth Apps separados para desenvolvimento e produção.

A integração nativa da Vercel publica a branch `main` e cria previews dos pull requests, sem guardar token de deploy no repositório. Em produção, restrinja merges em `main` exigindo a checagem **Validar projeto**. Os previews precisam de configuração própria de autenticação; eles podem usar `/interfaces` sem conectar o banco de produção.

**Estado da configuração:** o workflow de CI está incluído neste projeto. Ele será executado depois que o código for enviado ao GitHub. O deploy contínuo depende de importar e conectar esse repositório na Vercel; essa conexão não é criada pelo ZIP.

## Funcionalidades e limites

- Busca de restaurantes, categorias, favoritos no dispositivo e cardápio.
- Adicionais, tamanhos, quantidades e carrinho persistido.
- Cupom `PIZZA10`: desconto de 10% nos produtos, sem descontar a entrega.
- Checkout, histórico, acompanhamento e repetição de pedido.
- Perfil, endereços, produtos, configurações e pedidos salvos no Neon.
- Painel com alteração de status, cardápio, financeiro e exportação CSV.
- Menu lateral animado e animações ao rolar para baixo e para cima, respeitando a preferência por movimento reduzido.

A API recalcula os totais no servidor e valida os dados recebidos. Não há cobrança, integração com entregadores, GPS nem notificações externas. O andamento do pedido depende das ações no painel.

O TheMealDB fornece receitas e imagens, não preços ou disponibilidade. Na importação de alimentos, o proprietário define os dados do produto antes de salvar. `THEMEALDB_API_KEY=1` é a chave de teste; confira os termos do fornecedor antes de usar comercialmente.

A versão independente usa os provedores configurados acima. Dados de sessões ou IDs da hospedagem anterior não são migrados automaticamente. Para testar sem mexer no banco antigo, crie um banco ou branch de desenvolvimento no Neon.

## Problemas ao abrir localmente

Depois de executar `npm run dev`, mantenha o terminal aberto e visite `http://localhost:3000` no Chrome ou Edge. Para visualizar sem banco configurado, use `/interfaces`.

O desenvolvimento usa Webpack, assim como o build. Se quiser experimentar Turbopack, execute `npm run dev:turbo`.

Se o navegador interno do VS Code mostrar `ERR_INVALID_HTTP_RESPONSE`, teste o mesmo endereço no navegador externo. Esse erro não informa sozinho a causa; confira se o terminal mostra um erro depois do acesso. Experimente também `http://127.0.0.1:3000/interfaces` para verificar a resolução de localhost.

Após atualizar o projeto, pare o servidor com Ctrl+C, execute `npm ci` e inicie novamente. Não substitua seu `.env.local` pelas variáveis de exemplo.

## Versão 1.1.2

As animações de rolagem usam a Web Animations API e não alteram os atributos do HTML durante a hidratação. Continuam funcionando nos dois sentidos e respeitam a preferência por movimento reduzido.

Para investigar um erro 500 do catálogo, execute `npm run db:check` na pasta do projeto. O comando lê `.env` e `.env.local`, verifica a conexão e as tabelas e mostra apenas o resultado, sem imprimir a conexão. Se os dois arquivos existirem, `.env.local` tem prioridade. Não coloque a conexão no código nem em arquivos versionados.

Após substituir uma versão antiga, pare o servidor e remova apenas o cache gerado antes de iniciar novamente. No PowerShell:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm ci
npm run db:check
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Abra `http://127.0.0.1:3000`. O build e os testes não exigem conexão com banco; o catálogo normal usa o Neon configurado localmente. Atualize `NEXTAUTH_URL` para o mesmo endereço que usar no navegador ao configurar o login.
