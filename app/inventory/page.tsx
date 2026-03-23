import { permanentRedirect } from "next/navigation";

export default function InventoryPage() {
  permanentRedirect("/inventory/items");
}