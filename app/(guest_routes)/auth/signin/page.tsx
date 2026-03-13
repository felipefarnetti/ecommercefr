"use client";

// Importer les dépendances nécessaires
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import Link from "next/link";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import AuthFormContainer from "@components/AuthFormContainer";
import { formikFilterForm } from "@utils/formikHelpers";

// Initialisation des valeurs du formulaire
const initialValues = {
  email: "",
  password: "",
};

// Schéma de validation avec Yup
const validationSchema = yup.object().shape({
  email: yup.string().email("E-mail invalide").required("E-mail requis"),
  password: yup
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères")
    .required("Mot de passe requis"),
});

const SignIn = () => {
  // Utilisation du routeur Next.js
  const router = useRouter();

  const {
    values,
    isSubmitting,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    // Soumission du formulaire côté client
    onSubmit: async (values, action) => {
      const signInRes = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (signInRes?.error === "CredentialsSignin") {
        toast.error("Correspondance E-mail/Mot de passe incorrecte !");
      }

      if (!signInRes?.error) {
        // Rafraîchir la page après la connexion réussie
        router.refresh();
      }
    },
  });

  const formErrors: string[] = formikFilterForm(touched, errors, values);

  type valuesType = keyof typeof values;

  // Vérification des erreurs de validation pour chaque champ
  const error = (name: valuesType) =>
    errors[name] && touched[name] ? true : false;

  const { email, password } = values;

  return (
    <AuthFormContainer title="Se connecter" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <input
          name="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" "
          className={`peer w-full bg-slate-50 border ${error("email") ? "border-red-500" : "border-slate-200"} rounded-lg px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition-all`}
        />
        <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
          E-mail
        </label>
      </div>
      <div className="relative w-full">
        <input
          name="password"
          type="password"
          value={password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" "
          className={`peer w-full bg-slate-50 border ${error("password") ? "border-red-500" : "border-slate-200"} rounded-lg px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white transition-all`}
        />
        <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
          Mot de passe
        </label>
      </div>
      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        Se connecter
      </button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup" className="text-amber-600 hover:text-amber-700 font-medium">{"S'inscrire"}</Link>
        <Link href="/auth/forgot-password" className="text-amber-600 hover:text-amber-700 font-medium">Mot de passe oublié</Link>
      </div>

      <div className="">
        {formErrors.map((value, index) => {
          return (
            <div
              key={index}
              className="space-x-1 flex items-center text-red-500 "
            >
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{value}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
};

export default SignIn;
