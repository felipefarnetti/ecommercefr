import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
  onSubmit?(e: React.FormEvent<HTMLFormElement>): void;
}

export default function AuthFormContainer({ title, children, onSubmit }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
    >
      <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">
        {title}
      </h1>
      <div className="space-y-4">
        {children}
      </div>
    </form>
  );
}
