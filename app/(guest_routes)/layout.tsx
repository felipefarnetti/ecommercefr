// Importer les dépendances nécessaires
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { FC, ReactNode } from "react";
import NavBar from "@components/navbar";

// Interface définissant les propriétés attendues
interface Props {
  children: ReactNode;
}

// Composant de mise en page utilisé pour les utilisateurs non connectés (invités)
export default async function GuestLayout({ children }: Props) {
  const session = await auth();
  // console.log("session", session);

  // Rediriger vers la page d'accueil si une session est active
  if (session) return redirect("/");

  return (
    <div>
      <NavBar />
      {children}
    </div>
  );
}

// Version commentée en tant que composant fonctionnel
// const GuestLayout: FC<Props> = async ({ children }) => {
//   const session = await auth();
//   console.log("session", session);

//   // Rediriger vers la page d'accueil si une session est active
//   if (session) return redirect("/");

//   return <div>{children}</div>;
// };

// export default GuestLayout;
