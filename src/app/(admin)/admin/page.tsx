import { redirect } from "next/navigation";

// The /admin root redirects to the years management dashboard.
export default function AdminPage() {
  redirect("/admin/years");
}
