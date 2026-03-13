import React, { ReactNode } from "react";
import NavBar from "@components/navbar";
import Footer from "../components/Footer";

interface Props {
  children: ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-screen-xl mx-auto w-full xl:px-0 px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
