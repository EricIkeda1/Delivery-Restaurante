"use client";
import { createId } from "@/lib/id";
import { useState } from "react";
import { MapPin, Plus, Trash2, UserRound } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { Modal } from "@/components/ui/Modal";
import type { Profile } from "@/types";
export function ProfilePage() {
  const { data, loading, error, reload } = useAsync(api.profile);
  const [editedProfile, setForm] = useState<Profile | null>(null);
  const form = editedProfile ?? data ?? { name: "", phone: "", addresses: [] };
  const [modal, setModal] = useState(false);
  const [label, setLabel] = useState("Casa");
  const [street, setStreet] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(next: Profile) {
    setBusy(true);
    setMessage("");
    try {
      await api.saveProfile(next);
      setForm(next);
      setMessage("Dados salvos com sucesso.");
      setModal(false);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  return (
    <section className="section narrow">
      <span className="eyebrow">TUDO DO SEU JEITO</span>
      <h1>Meu perfil</h1>
      <div className="checkout-grid">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            void save(form);
          }}
        >
          <h3>
            <UserRound />
            Seus dados
          </h3>
          <label className="field">
            Nome completo
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            Telefone
            <input
              type="tel"
              maxLength={25}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(43) 99999-9999"
            />
          </label>
          <button disabled={busy} className="btn">
            {busy ? "Salvando…" : "Salvar alterações"}
          </button>
          {message && <p role="status">{message}</p>}
        </form>
        <div className="panel" id="enderecos">
          <div className="row">
            <h3>
              <MapPin />
              Meus endereços
            </h3>
            <button
              className="icon-btn"
              aria-label="Adicionar endereço"
              onClick={() => setModal(true)}
            >
              <Plus />
            </button>
          </div>
          {!form.addresses.length && (
            <p className="muted">
              Adicione um endereço para facilitar seu próximo pedido.
            </p>
          )}
          {form.addresses.map((a) => (
            <div className="saved-address" key={a.id}>
              <MapPin size={19} />
              <div className="grow">
                <b>{a.label}</b>
                <p>{a.street}</p>
              </div>
              <button
                className="icon-btn"
                aria-label="Excluir endereço"
                disabled={busy}
                onClick={() =>
                  void save({
                    ...form,
                    addresses: form.addresses.filter((x) => x.id !== a.id),
                  })
                }
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
          <button className="btn secondary full" onClick={() => setModal(true)}>
            <Plus size={17} />
            Adicionar endereço
          </button>
        </div>
      </div>
      {modal && (
        <Modal title="Novo endereço" onClose={() => setModal(false)}>
          <form
            className="modal-body"
            onSubmit={(e) => {
              e.preventDefault();
              void save({
                ...form,
                addresses: [
                  ...form.addresses,
                  { id: createId(), label, street },
                ],
              });
            }}
          >
            <label className="field">
              Identificação
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                maxLength={40}
              />
            </label>
            <label className="field">
              Endereço completo
              <textarea
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                minLength={10}
                maxLength={250}
              />
            </label>
            <button disabled={busy} className="btn full">
              Salvar endereço
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
