"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect } from "react";
import { toast } from "react-toastify";

const Verify: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ userId, token }),
    }).then(async (res) => {
      const apiRes = await res.json();
      const { message, error } = apiRes as { message: string; error: string };
      if (res.ok) {
        console.log(message);
      }
      if (!res.ok) {
        toast.error(error);
      }
      router.replace("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userId || !token) return notFound();

  return (
    <div className=" text-3xl opacity-70 text-center animate-pulse p-5">
      Patientez .....
      <p>Vérification de votre adresse mail!</p>
    </div>
  );
};

export default Verify;
