// app/admin/page.js

import AdminLogin from "../../components/AdminLogin";

export const metadata = {
  title: "Acceso Administrativo | Nutricionista Jorge Valdez",
  robots: "noindex, nofollow",
};

export default function LoginPage() {
  return <AdminLogin />;
}