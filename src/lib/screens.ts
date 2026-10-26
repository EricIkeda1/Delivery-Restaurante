export const screens = [
  {
    id: "entrar",
    name: "Entrar",
    group: "Cliente",
    path: "/entrar",
    description: "Acesso à sua conta",
  },
  {
    id: "cadastro",
    name: "Criar conta",
    group: "Cliente",
    path: "/cadastro",
    description: "Cadastro e dados pessoais",
  },
  {
    id: "recuperar-senha",
    name: "Recuperar acesso",
    group: "Cliente",
    path: "/recuperar-senha",
    description: "Ajuda para entrar novamente",
  },
  {
    id: "inicio",
    name: "Início e restaurantes",
    group: "Cliente",
    path: "/",
    description: "Descubra os sabores da cidade",
  },
  {
    id: "buscar",
    name: "Busca e filtros",
    group: "Cliente",
    path: "/buscar",
    description: "Encontre restaurantes e pratos",
  },
  {
    id: "cardapio",
    name: "Restaurante e cardápio",
    group: "Cliente",
    path: "/loja/bella-massa",
    description: "Conheça a Pizzaria Bella Massa",
  },
  {
    id: "produto",
    name: "Produto e adicionais",
    group: "Cliente",
    path: "/produto/calabresa",
    description: "Monte o pedido do seu jeito",
  },
  {
    id: "carrinho",
    name: "Carrinho",
    group: "Cliente",
    path: "/carrinho",
    description: "Itens, quantidades e cupom",
  },
  {
    id: "checkout",
    name: "Checkout",
    group: "Cliente",
    path: "/checkout",
    description: "Endereço e pagamento demonstrativo",
  },
  {
    id: "confirmado",
    name: "Pedido confirmado",
    group: "Cliente",
    path: "/pedido/exemplo/confirmado",
    description: "Confirmação e próximos passos",
  },
  {
    id: "acompanhar",
    name: "Acompanhar entrega",
    group: "Cliente",
    path: "/pedido/exemplo",
    description: "Etapas do pedido e entrega",
  },
  {
    id: "pedidos",
    name: "Meus pedidos",
    group: "Cliente",
    path: "/pedidos",
    description: "Pedidos em andamento e histórico",
  },
  {
    id: "perfil",
    name: "Perfil e endereços",
    group: "Cliente",
    path: "/perfil",
    description: "Dados pessoais e locais de entrega",
  },
  {
    id: "favoritos",
    name: "Favoritos",
    group: "Cliente",
    path: "/favoritos",
    description: "Seus restaurantes preferidos",
  },
  {
    id: "cupons",
    name: "Cupons",
    group: "Cliente",
    path: "/cupons",
    description: "Descontos para o próximo pedido",
  },
  {
    id: "ajuda",
    name: "Ajuda",
    group: "Cliente",
    path: "/ajuda",
    description: "Respostas para suas dúvidas",
  },
  {
    id: "painel",
    name: "Visão geral",
    group: "Restaurante",
    path: "/restaurante",
    description: "Indicadores e vendas da semana",
  },
  {
    id: "gerenciar-pedidos",
    name: "Gerenciar pedidos",
    group: "Restaurante",
    path: "/restaurante/pedidos",
    description: "Da cozinha até a entrega",
  },
  {
    id: "detalhes-pedido",
    name: "Detalhes do pedido",
    group: "Restaurante",
    path: "/restaurante/pedidos/exemplo",
    description: "Cliente, itens e ações do pedido",
  },
  {
    id: "gerenciar-cardapio",
    name: "Gerenciar cardápio",
    group: "Restaurante",
    path: "/restaurante/cardapio",
    description: "Produtos e disponibilidade",
  },
  {
    id: "editar-produto",
    name: "Editar produto",
    group: "Restaurante",
    path: "/restaurante/cardapio/calabresa/editar",
    description: "Imagem, descrição, categoria e preço",
  },
  {
    id: "financeiro",
    name: "Financeiro",
    group: "Restaurante",
    path: "/restaurante/financeiro",
    description: "Movimentações e exportação",
  },
  {
    id: "configuracoes",
    name: "Configurações da loja",
    group: "Restaurante",
    path: "/restaurante/configuracoes",
    description: "Informações, horários e entrega",
  },
] as const;
export function previewHref(href: string) {
  if (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/previa/") ||
    href.startsWith("/interfaces") ||
    href.startsWith("/signin-") ||
    href.startsWith("/signout-")
  )
    return href;
  const url = new URL(href, "https://eyi.local");
  const pathname = url.pathname;
  const query = new URLSearchParams(url.search);
  let screen: string | undefined;
  if (["/favoritos", "/cupons", "/ajuda"].includes(pathname))
    screen = pathname.slice(1);
  else if (pathname === "/restaurante/alimentos") screen = "alimentos";
  else if (/^\/restaurante\/cardapio\/[^/]+\/editar$/.test(pathname)) {
    screen = "editar-produto";
    query.set("id", decodeURIComponent(pathname.split("/")[3]));
  } else if (/^\/restaurante\/pedidos\/[^/]+$/.test(pathname)) {
    screen = "detalhes-pedido";
    query.set("id", decodeURIComponent(pathname.split("/")[3]));
  } else if (/^\/produto\/[^/]+$/.test(pathname)) {
    screen = "produto";
    query.set("id", decodeURIComponent(pathname.split("/")[2]));
  } else if (/^\/loja\/[^/]+$/.test(pathname)) {
    screen = "cardapio";
    query.set("id", decodeURIComponent(pathname.split("/")[2]));
  } else if (/^\/pedido\/[^/]+(?:\/confirmado)?$/.test(pathname)) {
    screen = pathname.endsWith("/confirmado") ? "confirmado" : "acompanhar";
    const id = decodeURIComponent(pathname.split("/")[2]);
    if (id !== "exemplo") query.set("id", id);
  } else screen = screens.find((s) => s.path === pathname)?.id;
  return screen
    ? "/previa/" +
        screen +
        (query.size ? "?" + query.toString() : "") +
        url.hash
    : href;
}
export function appHref(href: string) {
  return typeof window !== "undefined" &&
    window.location.pathname.startsWith("/previa/")
    ? previewHref(href)
    : href;
}
export function navigate(href: string) {
  window.location.assign(appHref(href));
}
