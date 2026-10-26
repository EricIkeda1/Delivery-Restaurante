"use client";
import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  ShieldCheck,
  UserRound,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Brand } from "@/components/ui/Brand";
import { api } from "@/services/api";
import { appHref, navigate } from "@/lib/screens";
export function AuthPage() {
  const path = usePathname();
  const register = path.endsWith("/cadastro");
  const reset = path.endsWith("/recuperar-senha");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function registerProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const current = await api.profile();
      await api.saveProfile({ ...current, name, phone });
      navigate(appHref("/"));
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function login() {
    const destination = new URLSearchParams(window.location.search).get(
      "callbackUrl",
    );
    const callbackUrl =
      destination?.startsWith("/") && !destination.startsWith("//")
        ? destination
        : register
          ? "/cadastro"
          : "/perfil";
    void signIn("github", { callbackUrl });
  }
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src="/assets/hero.jpg" alt="Pizza artesanal" />
        <div>
          <Brand />
          <h1>
            Seu próximo
            <br />
            sabor favorito
            <br />
            <em>começa aqui.</em>
          </h1>
          <p>
            Os melhores restaurantes da sua cidade,
            <br />a um pedido de distância.
          </p>
          <div className="auth-visual-tags">
            <span>🍕 Feito na hora</span>
            <span>🛵 Entregue com carinho</span>
          </div>
        </div>
      </div>
      <div className="auth-content">
        <div className="row">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} />
            Voltar ao início
          </Link>
          <Link className="text-link" href="/interfaces">
            Todas as telas
          </Link>
        </div>
        <div className="auth-form">
          <Brand />
          <div className="auth-tabs">
            <Link
              className={!register && !reset ? "active" : ""}
              href="/entrar"
            >
              Entrar
            </Link>
            <Link className={register ? "active" : ""} href="/cadastro">
              Criar conta
            </Link>
          </div>
          <span className="eyebrow">
            {reset ? "VAMOS AJUDAR VOCÊ" : "BEM-VINDO À MESA"}
          </span>
          <h1>
            {reset
              ? "Vamos recuperar seu acesso."
              : register
                ? "Crie seu perfil."
                : "Que bom ter você aqui."}
          </h1>
          <p>
            {reset
              ? "Seu acesso é gerenciado pelo GitHub. Recupere sua conta no próprio provedor e volte para entrar."
              : register
                ? "Conte um pouquinho sobre você para deixar seus próximos pedidos mais práticos."
                : "Sua próxima boa pedida está esperando. Entre para pedir, acompanhar e salvar seus dados."}
          </p>
          {register ? (
            <form onSubmit={registerProfile}>
              <button
                type="button"
                className="btn secondary full"
                onClick={login}
              >
                Entrar com GitHub antes de salvar
              </button>
              <label className="field">
                Nome completo
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como podemos chamar você?"
                  autoComplete="name"
                />
              </label>
              <label className="field">
                Telefone
                <input
                  type="tel"
                  maxLength={25}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(43) 99999-9999"
                  autoComplete="tel"
                />
              </label>
              <div className="auth-security">
                <UserRound size={18} />
                <span>
                  O perfil é vinculado à sua conta autenticada nesta plataforma.
                </span>
              </div>
              <button className="btn full" disabled={busy}>
                {busy ? "Salvando…" : "Criar meu perfil"}
                <ArrowRight size={16} />
              </button>
              {message && (
                <p className="form-error" role="alert">
                  {message}
                </p>
              )}
            </form>
          ) : (
            <>
              <div className="auth-method-icon">
                {reset ? <Mail size={26} /> : <UserRound size={26} />}
              </div>
              {reset ? (
                <a
                  className="btn full"
                  href="https://github.com/password_reset"
                >
                  Recuperar minha conta no GitHub <ArrowRight size={16} />
                </a>
              ) : (
                <button className="btn full" type="button" onClick={login}>
                  Continuar com GitHub <ArrowRight size={16} />
                </button>
              )}
              {!reset && (
                <Link className="text-link" href="/recuperar-senha">
                  Esqueceu seu acesso?
                </Link>
              )}
              {reset && (
                <Link className="text-link" href="/entrar">
                  Voltar para entrar
                </Link>
              )}
            </>
          )}
          <div className="auth-security spaced">
            <ShieldCheck size={19} />
            <span>
              Seu acesso usa uma sessão protegida com Auth.js. O EYI Food não
              armazena senhas.
            </span>
          </div>
          <p className="fine-print">
            Projeto fictício de delivery • Sem pedidos ou cobranças reais.
          </p>
        </div>
      </div>
    </div>
  );
}
