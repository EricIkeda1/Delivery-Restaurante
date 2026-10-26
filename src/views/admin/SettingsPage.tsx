"use client";
import { useState } from "react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import type { StoreSettings } from "@/types";
export function SettingsPage() {
  const { data, loading, error, reload } = useAsync(api.settings);
  const [editedSettings, setForm] = useState<StoreSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const form = editedSettings ?? data;
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  if (!form) return null;
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.saveSettings(form!);
      setMessage("Configurações salvas com sucesso.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <span className="eyebrow">OS DETALHES FAZEM A CASA</span>
      <h1>Configurações da loja</h1>
      <p className="muted">Deixe tudo pronto para receber bem.</p>
      <form className="settings-grid" onSubmit={save}>
        <div className="panel">
          <h3>Informações da loja</h3>
          <label className="field">
            Nome do restaurante
            <input
              required
              value={form.name}
              maxLength={100}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            Descrição
            <textarea
              required
              maxLength={500}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label className="field">
            Endereço
            <input
              required
              maxLength={250}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <label className="field">
            Horário de funcionamento
            <input
              required
              value={form.hours}
              maxLength={100}
              onChange={(e) => setForm({ ...form, hours: e.target.value })}
            />
          </label>
        </div>
        <div className="panel">
          <div className="store-logo">
            🍕<b>{form.name}</b>
          </div>
          <h3>Entrega e atendimento</h3>
          <label className="field">
            Taxa de entrega (R$)
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.fee}
              onChange={(e) =>
                setForm({ ...form, fee: Number(e.target.value) })
              }
            />
          </label>
          <label className="field">
            Pedido mínimo (R$)
            <input
              type="number"
              min="0"
              max="500"
              step="0.01"
              value={form.minimum}
              onChange={(e) =>
                setForm({ ...form, minimum: Number(e.target.value) })
              }
            />
          </label>
          <label className="field">
            Preparo estimado (minutos)
            <input
              type="number"
              min="5"
              max="180"
              value={form.minutes}
              onChange={(e) =>
                setForm({ ...form, minutes: Number(e.target.value) })
              }
            />
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={form.open}
              onChange={(e) => setForm({ ...form, open: e.target.checked })}
            />
            Loja aberta para pedidos
          </label>
          <button className="btn full" disabled={busy}>
            {busy ? "Salvando…" : "Salvar configurações"}
          </button>
          {message && <p role="status">{message}</p>}
        </div>
      </form>
    </>
  );
}
