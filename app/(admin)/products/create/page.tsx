"use client";

import { newProductInfoSchema } from "@utils/validationSchema";
import { NewProductInfo } from "@app/types";
import ProductForm from "@components/ProductForm";
import React from "react";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
import { uploadImage } from "@utils/helper";
import { createProduct } from "../action";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();

  // Gérer la création d'un produit
  const handleCreateProduct = async (values: NewProductInfo) => {
    try {
      const { thumbnail, images } = values;

      // Valider les données du produit
      await newProductInfoSchema.validate(values, { abortEarly: false });

      // Télécharger la vignette du produit
      const thumbnailRes = await uploadImage(thumbnail!);

      // Télécharger les images du produit
      let productImages: { url: string; id: string }[] = [];
      if (images) {
        const uploadPromise = images.map(async (imageFile) => {
          const { id, url } = await uploadImage(imageFile);
          return { id, url };
        });

        productImages = await Promise.all(uploadPromise);
      }

      // Créer le produit
      await createProduct({
        ...values,
        price: {
          base: values.mrp,
          discounted: values.salePrice,
        },
        thumbnail: thumbnailRes,
        images: productImages,
      });

      // Rafraîchir la page et rediriger vers la liste des produits
      router.refresh();
      router.push("/products");
    } catch (error) {
      if (error instanceof ValidationError) {
        // Afficher les erreurs de validation
        error.inner.map((err) => {
          toast.error(err.message);
        });
      }
    }
  };

  // Renvoyer le formulaire de création de produit
  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}
