// Importer les dépendances nécessaires
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import AdminSidebar from "@components/AdminSidebar";

interface Props {
  children: ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  // Verify that the user is logged in and is an admin
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  // If the user is not an admin, redirect to the sign-in page
  if (!isAdmin) return redirect("/auth/signin");

  // Return the AdminSidebar component with the children as props
  return <AdminSidebar>{children}</AdminSidebar>;
}
