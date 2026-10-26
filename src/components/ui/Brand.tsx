import Link from "./AppLink";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label="EYI Food início">
      <img src="/assets/logo.png" alt="" />
      <span>
        EYI <b>Food</b>
        {!compact && <small>Delivery de restaurantes</small>}
      </span>
    </Link>
  );
}
