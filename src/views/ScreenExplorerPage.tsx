"use client";
import { useState } from "react";
import Link from "@/components/ui/AppLink";
import {
  Monitor,
  Smartphone,
  ExternalLink,
  ChevronRight,
  LayoutGrid,
  ArrowLeft,
} from "lucide-react";
import { screens } from "@/lib/screens";
import { Brand } from "@/components/ui/Brand";
export function ScreenExplorerPage() {
  const [selected, setSelected] = useState<string>("inicio");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const screen = screens.find((s) => s.id === selected)!;
  return (
    <div className="screen-explorer">
      <aside className="explorer-sidebar">
        <Brand />
        <Link href="/" className="back-link">
          <ArrowLeft size={14} />
          Voltar ao delivery
        </Link>
        <div className="explorer-title">
          <span className="eyebrow">PROJETO COMPLETO</span>
          <h1>
            Todas as telas
            <span>{screens.length} interfaces. Desktop e mobile.</span>
          </h1>
        </div>
        {["Cliente", "Restaurante"].map((group) => (
          <section key={group}>
            <h2>
              {group}
              <small>
                {screens.filter((s) => s.group === group).length} telas
              </small>
            </h2>
            <nav>
              {screens.map(
                (s, i) =>
                  s.group === group && (
                    <button
                      key={s.id}
                      className={selected === s.id ? "active" : ""}
                      onClick={() => setSelected(s.id)}
                    >
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <b>{s.name}</b>
                      <ChevronRight size={13} />
                    </button>
                  ),
              )}
            </nav>
          </section>
        ))}
      </aside>
      <div className="explorer-main">
        <header className="explorer-toolbar">
          <div>
            <span className="eyebrow">{screen.group}</span>
            <h2>{screen.name}</h2>
            <p>{screen.description}</p>
          </div>
          <div className="explorer-actions">
            <div className="device-switch" aria-label="Dispositivo">
              <button
                aria-pressed={device === "desktop"}
                className={device === "desktop" ? "active" : ""}
                onClick={() => setDevice("desktop")}
              >
                <Monitor size={16} />
                <span>Desktop</span>
              </button>
              <button
                aria-pressed={device === "mobile"}
                className={device === "mobile" ? "active" : ""}
                onClick={() => setDevice("mobile")}
              >
                <Smartphone size={16} />
                <span>Mobile</span>
              </button>
            </div>
            <Link
              href={"/previa/" + screen.id}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              aria-label="Abrir tela em outra aba"
            >
              <ExternalLink size={18} />
            </Link>
          </div>
        </header>
        <div className="explorer-mobile-picker">
          <label htmlFor="screen-select">Escolher tela</label>
          <select
            id="screen-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {screens.map((s, i) => (
              <option key={s.id} value={s.id}>
                {String(i + 1).padStart(2, "0")} • {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className={"explorer-canvas " + device}>
          <div className="preview-frame">
            <div className="frame-toolbar">
              <span />
              <span />
              <span />
              <small>EYI Food • {screen.name}</small>
            </div>
            <iframe
              key={screen.id + device}
              src={"/previa/" + screen.id}
              title={"Prévia " + screen.name + " " + device}
            />
          </div>
        </div>
        <div className="explorer-caption">
          <LayoutGrid size={14} />
          <span>
            Dados ilustrativos para visualizar todas as telas. As ações desta
            prévia ficam separadas do banco.
          </span>
          <Link
            className="text-link"
            href={screen.path.includes("exemplo") ? "/pedidos" : screen.path}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ir para o aplicativo <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
