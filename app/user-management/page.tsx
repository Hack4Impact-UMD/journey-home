import { permanentRedirect } from "next/navigation";

export default function UserManagementHome() {
  permanentRedirect("/user-management/all-accounts");
}
