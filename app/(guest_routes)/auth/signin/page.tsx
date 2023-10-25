"use client";

// Importer les dépendances nécessaires
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
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
      <Input
        name="email"
        label="E-mail"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        crossOrigin="anonymous"
      />
      <Input
        name="password"
        label="Mot de passe"
        type="password"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password")}
        crossOrigin="anonymous"
      />
      <Button
        disabled={isSubmitting}
        color="blue"
        type="submit"
        className="w-full"
      >
        Se connecter
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup">S'inscrire</Link>
        <Link href="/auth/forgot-password">Mot de passe oublié</Link>
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
