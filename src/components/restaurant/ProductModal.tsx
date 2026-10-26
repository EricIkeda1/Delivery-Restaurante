import { Modal } from "@/components/ui/Modal";
import { ProductConfiguration } from "./ProductConfiguration";
import type { Product } from "@/types";
export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <Modal title="Do seu jeito" onClose={onClose}>
      <ProductConfiguration product={product} onAdded={onClose} />
    </Modal>
  );
}
