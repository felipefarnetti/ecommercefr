"use client";
// Importation des dépendances nécessaires
import { SessionProvider } from "next-auth/react";
import React, { FC, ReactNode } from "react";
import { GuestCartProvider } from "@hooks/useGuestCart";

interface Props {
  children: ReactNode;
}

const AuthSession: FC<Props> = ({ children }) => {
  return (
    <SessionProvider>
      <GuestCartProvider>{children}</GuestCartProvider>
    </SessionProvider>
  );
};

export default AuthSession;
