import { permanentRedirect } from "next/navigation";

export default function InventoryHome() {
  permanentRedirect("/inventory/warehouse");
}
