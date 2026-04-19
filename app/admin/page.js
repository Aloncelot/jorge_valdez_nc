// app/admin/page.js

import AdminPanel from "../../components/AdminPanel";

export const metadata = {
  title: "Panel de Administración | Moderación de Reseñas",
  robots: "noindex, nofollow",
};

export default function AdminPage() {
  return <AdminPanel />;
}