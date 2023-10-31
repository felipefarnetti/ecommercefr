"use client";
// Importation des dépendances nécessaires
import { Button, Input } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  ChangeEventHandler,
  useEffect,
  useState,
  useTransition,
} from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { extractPublicId, uploadImage } from "@utils/helper";
import {
  createFeaturedProduct,
  updateFeaturedProduct,
} from "@app/(admin)/products/featured/action";
import { FeaturedProductForUpdate } from "../types";
import { removeImageFromCloud } from "@app/(admin)/products/action";

export interface FeaturedProduct {
  file?: File;
  title: string;
  link: string;
  linkTitle: string;
}

interface Props {
  initialValue?: any;
}

// Schéma de validation pour les propriétés communes des produits en vedette
const commonValidationFeaturedProduct = {
  title: Yup.string().required("Le titre est requis"),
  link: Yup.string().required("Le lien est requis"),
  linkTitle: Yup.string().required("Le titre du lien est requis"),
};

// Schéma de validation pour un nouveau produit en vedette
const newFeaturedProductValidationSchema = Yup.object().shape({
  file: Yup.mixed<File>()
    .required("Le fichier est requis")
    .test(
      "fileType",
      "Format de fichier non valide. Seules les images sont autorisées.",
      (value) => {
        if (value) {
          const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
          return supportedFormats.includes((value as File).type);
        }
        return true;
      }
    ),
  ...commonValidationFeaturedProduct,
});

// Schéma de validation pour la mise à jour d'un produit en vedette existant
const oldFeaturedProductValidationSchema = Yup.object().shape({
  file: Yup.mixed<File>().test(
    "fileType",
    "Format de fichier non valide. Seules les images sont autorisées.",
    (value) => {
      if (value) {
        const supportedFormats = ["image/jpeg", "image/png", "image/gif"];
        return supportedFormats.includes((value as File).type);
      }
      return true;
    }
  ),
  ...commonValidationFeaturedProduct,
});

const defaultProduct = {
  title: "",
  link: "",
  linkTitle: "",
};

export default function FeaturedProductForm({ initialValue }: Props) {
  const [isPending, startTransition] = useTransition(); // Utilisation de useTransition pour gérer les transitions asynchrones
  const [isForUpdate, setIsForUpdate] = useState(false); // Indique si c'est une mise à jour
  const [featuredProduct, setFeaturedProduct] =
    useState<FeaturedProduct>(defaultProduct); // État du produit en vedette
  const router = useRouter(); // Utilisation de l'utilitaire de navigation de Next.js

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { name, value, files } = target;

    if (name === "file" && files) {
      const file = files[0];
      if (file) setFeaturedProduct({ ...featuredProduct, file });
    } else setFeaturedProduct({ ...featuredProduct, [name]: value });
  };

  // Fonction pour gérer la mise à jour d'un produit en vedette
  const handleUpdate = async () => {
    try {
      const { file, link, linkTitle, title } =
        await oldFeaturedProductValidationSchema.validate(
          { ...featuredProduct },
          { abortEarly: false }
        );

      const data: FeaturedProductForUpdate = { link, linkTitle, title };

      if (file) {
        const publicId = extractPublicId(initialValue.banner);
        removeImageFromCloud(publicId);
        const banner = await uploadImage(file);
        data.banner = banner;
      }

      await updateFeaturedProduct(initialValue.id, data); // Appel à la fonction de mise à jour
      router.refresh();
      router.push("/products/featured/add");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.map((err) => {
          toast.error(err.message); // Affiche les erreurs de validation
        });
      }
    }
  };

  // Fonction pour gérer la création d'un nouveau produit en vedette
  const handleCreate = async () => {
    try {
      const { file, link, linkTitle, title } =
        await newFeaturedProductValidationSchema.validate(
          { ...featuredProduct },
          { abortEarly: false }
        );

      const banner = await uploadImage(file);
      await createFeaturedProduct({ banner, link, linkTitle, title }); // Appel à la fonction de création
      router.refresh();
      setFeaturedProduct({ ...defaultProduct });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.map((err) => {
          toast.error(err.message); // Affiche les erreurs de validation
        });
      }
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async () => {
    if (isForUpdate) await handleUpdate();
    else await handleCreate();
  };

  // Effet pour mettre à jour le produit en vedette s'il existe une valeur initiale
  useEffect(() => {
    if (initialValue) {
      setFeaturedProduct({ ...initialValue });
      setIsForUpdate(true);
    }
  }, [initialValue]);

  const poster = featuredProduct.file
    ? URL.createObjectURL(featuredProduct.file)
    : initialValue?.banner || "";

  const { link, linkTitle, title } = featuredProduct;

  return (
    <form
      action={() => startTransition(async () => await handleSubmit())}
      className="py-4 space-y-4"
    >
      <label htmlFor="banner-file">
        <input
          type="file"
          accept="image/*"
          id="banner-file"
          name="file"
          onChange={handleChange}
          hidden
        />
        <div className="h-[380px] w-full flex flex-col items-center justify-center border border-dashed border-blue-gray-400 rounded cursor-pointer relative">
          {poster ? (
            <Image alt="banner" src={poster || initialValue?.banner} fill />
          ) : (
            <>
              <span>Sélectionner une bannière</span>
              <span>1140 x 380</span>
            </>
          )}
        </div>
      </label>
      <Input
        label="Titre"
        name="title"
        value={title}
        onChange={handleChange}
        crossOrigin={"anonymous"}
      />
      <div className="flex space-x-4">
        <Input
          label="Lien"
          name="link"
          value={link}
          onChange={handleChange}
          crossOrigin={"anonymous"}
        />
        <Input
          label="Titre du Lien"
          name="linkTitle"
          value={linkTitle}
          onChange={handleChange}
          crossOrigin={"anonymous"}
        />
      </div>
      <div className="text-right">
        <Button disabled={isPending} type="submit" color="blue">
          {isForUpdate ? "Mettre à jour" : "Soumettre"}
        </Button>
      </div>
    </form>
  );
}
