import Link from "@/components/ui/AppLink";
import { CircleHelp, ChevronDown, ArrowRight } from "lucide-react";
const questions = [
  {
    q: "Como faço um pedido?",
    a: "Escolha um restaurante, abra o produto e selecione suas opções. Adicione à sacola e siga para o checkout para confirmar endereço e forma de pagamento demonstrativa.",
  },
  {
    q: "Como acompanho minha entrega?",
    a: "Abra Meus pedidos e selecione o pedido. O status é atualizado conforme o restaurante avança de preparo até entrega. Este projeto não usa localização por GPS.",
  },
  {
    q: "Como altero meus endereços?",
    a: "Entre em Meu perfil ou Meus endereços. Você pode adicionar um endereço completo e selecioná-lo no checkout.",
  },
  {
    q: "Como uso um cupom?",
    a: "Use PIZZA10 na sacola ou ative o cupom na página Cupons. O desconto de 10% vale para os itens, sem alterar a taxa de entrega.",
  },
  {
    q: "Onde ficam meus favoritos?",
    a: "Toque no coração do restaurante para favoritar. Os favoritos ficam salvos neste navegador e podem ser acessados no menu Favoritos.",
  },
  {
    q: "Preciso pagar para testar?",
    a: "Não. O EYI Food é um projeto fictício. Os pedidos e pagamentos são demonstrativos; não informe dados reais de cartão.",
  },
  {
    q: "Como acesso o painel do restaurante?",
    a: "Use Acessar painel no menu lateral. A área permite gerenciar cardápio, pedidos, financeiro e configurações. No aplicativo, o acesso é restrito ao proprietário autenticado.",
  },
];
export function HelpPage() {
  return (
    <section className="section">
      <span className="eyebrow">VAMOS FACILITAR SEU PEDIDO</span>
      <h1>
        Como podemos ajudar? <CircleHelp size={27} />
      </h1>
      <p className="muted">
        Respostas rápidas para você aproveitar o EYI Food.
      </p>
      <div className="help-list">
        {questions.map((item) => (
          <details className="help-question" key={item.q}>
            <summary>
              {item.q}
              <ChevronDown size={18} />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <Link className="btn secondary" href="/perfil">
        Acessar meu perfil
        <ArrowRight size={15} />
      </Link>
    </section>
  );
}
