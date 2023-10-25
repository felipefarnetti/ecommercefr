"use client";

// Importer les dépendances nécessaires
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Link from "next/link";
import { signIn } from "next-auth/react";

import AuthFormContainer from "@components/AuthFormContainer";
import { formikFilterForm } from "@utils/formikHelpers";

// Schéma de validation avec Yup
const validationSchema = yup.object().shape({
  name: yup.string().required("Nom requis"),
  email: yup.string().email("E-mail invalide").required("E-mail requis"),
  password: yup
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères")
    .required("Mot de passe requis"),
  password2: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe doivent correspondre")
    .required("Confirmation du mot de passe requise"),
});

const SignUp = () => {
  const {
    values,
    isSubmitting,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: { name: "", email: "", password: "", password2: "" },
    validationSchema,
    // Soumission du formulaire côté client
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };
      if (res.ok) {
        toast.success(message);
        // Connexion automatique après l'inscription
        await signIn("credentials", { email, password });
      }
      if (!res.ok && error) {
        toast.error(error);
      }

      action.setSubmitting(false);
    },
  });

  const formErrors: string[] = formikFilterForm(touched, errors, values);

  type valuesType = keyof typeof values;

  const { name, email, password, password2 } = values;

  // Vérification des erreurs de validation pour chaque champ
  const error = (name: valuesType) =>
    errors[name] && touched[name] ? true : false;

  return (
    <AuthFormContainer title="Créez votre compte" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Nom"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("name")}
        crossOrigin="anonymous"
      />
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
      <Input
        name="password2"
        label="Confirmer le mot de passe"
        value={password2}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password2")}
        type="password"
        crossOrigin={"anonymous"}
      />
      <Button
        disabled={isSubmitting}
        color="blue"
        type="submit"
        className="w-full"
      >
        S'inscrire
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin">Se connecter</Link>
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

export default SignUp;
