import { useEffect, useState, useCallback, useRef } from "react";
export function useAsync<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const generation = useRef(0);
  const active = useRef(true);
  const reload = useCallback(async () => {
    const id = ++generation.current;
    setError("");
    setLoading(true);
    try {
      const value = await load();
      if (active.current && id === generation.current) setData(value);
    } catch (e) {
      if (active.current && id === generation.current)
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível carregar os dados.",
        );
    } finally {
      if (active.current && id === generation.current) setLoading(false);
    }
  }, [load]);
  useEffect(() => {
    active.current = true;
    // Loading is tied to the request lifecycle, including a change of loader.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
    return () => {
      active.current = false;
    };
  }, [reload]);
  return { data, error, loading, reload, setData };
}
