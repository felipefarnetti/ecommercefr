"use client";

// Importer les dépendances nécessaires
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
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
      <Input
        name="email"
        label="E-mail"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        crossOrigin={"anonymous"}
      />
      <Button
        disabled={isSubmitting}
        color="blue"
        type="submit"
        className="w-full"
      >
        {"Envoyer l'e-mail"}
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup">{"S'inscrire"}</Link>
        <Link href="/auth/signin">Se connecter</Link>
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
