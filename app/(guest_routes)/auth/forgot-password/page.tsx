"use client";

// Importer les dépendances nécessaires
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";

import AuthFormContainer from "@components/AuthFormContainer";
import { formikFilterForm } from "@utils/formikHelpers";

// Initialisation des valeurs du formulaire
const initialValues = {
  email: "",
};

// Schéma de validation avec Yup
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Adresse e-mail invalide.")
    .required("Une adresse e-mail est requise."),
});

const ForgotPassword = () => {
  // Utilisation de useFormik pour gérer le formulaire
  const {
    values,
    isSubmitting,
    errors,
    touched,
    setSubmitting,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema,
    // Soumission du formulaire côté client
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };
      if (res.ok) {
        // Affichage d'un message de succès
        toast.success(message);
      }
      if (!res.ok && error) {
        // Affichage d'un message d'erreur
        toast.error(error);
      }
      action.setSubmitting(false);
    },
  });

  const formErrors: string[] = formikFilterForm(touched, errors, values);

  type valuesType = keyof typeof values;

  // Vérification des erreurs de validation pour chaque champ
  const error = (name: valuesType) =>
    errors[name] && touched[name] ? true : false;

  const { email } = values;

  return (
    <AuthFormContainer
      title="Veuillez rentrer votre adresse mail"
      onSubmit={handleSubmit}
    >
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
      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
      >
        {"Envoyer l'e-mail"}
      </button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup" className="text-amber-600 hover:text-amber-700 font-medium">{"S'inscrire"}</Link>
        <Link href="/auth/signin" className="text-amber-600 hover:text-amber-700 font-medium">Se connecter</Link>
      </div>
      <div className="">
        {formErrors.map((value, index) => {
          return (
            <div
              key={index}
              className="space-x-1 flex items-center text-red-500"
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

export default ForgotPassword;
