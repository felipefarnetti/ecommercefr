"use client";

import React, {
  useEffect,
  useState,
  useTransition,
  ChangeEventHandler,
} from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import categories from "@utils/categories";
import ImageSelector from "@components/ImageSelector";
import { NewProductInfo } from "@app/types";

interface Props {
  initialValue?: InitialValue;
  onSubmit(values: NewProductInfo): void;
  onImageRemove?(source: string): void;
}

export interface InitialValue {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images?: string[];
  bulletPoints: string[];
  mrp: number;
  salePrice: number;
  category: string;
  quantity: number;
}

const defaultValue = {
  title: "",
  description: "",
  bulletPoints: [""],
  mrp: 0,
  salePrice: 0,
  category: "",
  quantity: 0,
};

export default function ProductForm(props: Props) {
  const { onSubmit, onImageRemove, initialValue } = props;
  const [isPending, startTransition] = useTransition();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File>();
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [productInfo, setProductInfo] = useState({ ...defaultValue });
  const [thumbnailSource, setThumbnailSource] = useState<string[]>();
  const [productImagesSource, setProductImagesSource] = useState<string[]>();

  const fields = productInfo.bulletPoints;

  // Fonction pour ajouter plus de mots clés
  const addMoreBulletPoints = () => {
    setProductInfo({
      ...productInfo,
      bulletPoints: [...productInfo.bulletPoints, ""],
    });
  };

  // Fonction pour supprimer un mot clé
  const removeBulletPoint = (indexToRemove: number) => {
    const points = [...productInfo.bulletPoints];
    const filteredPoints = points.filter((_, index) => index !== indexToRemove);
    setProductInfo({
      ...productInfo,
      bulletPoints: [...filteredPoints],
    });
  };

  // Fonction pour mettre à jour la valeur d'un mot clé
  const updateBulletPointValue = (value: string, index: number) => {
    const oldValues = [...fields];
    oldValues[index] = value;

    setProductInfo({ ...productInfo, bulletPoints: [...oldValues] });
  };

  // Fonction pour supprimer une image
  const removeImage = async (index: number) => {
    if (!productImagesSource) return;

    // Si l'image provient du cloud, nous voulons la supprimer du cloud.
    const imageToRemove = productImagesSource[index];
    const cloudSourceUrl = "https://res.cloudinary.com";
    if (imageToRemove.startsWith(cloudSourceUrl)) {
      onImageRemove && onImageRemove(imageToRemove);
    } else {
      // Si cette image provient de l'état local, nous voulons mettre à jour l'état local
      const fileIndexDifference =
        productImagesSource.length - imageFiles.length;
      const indexToRemove = index - fileIndexDifference;
      const newImageFiles = imageFiles.filter((_, i) => {
        if (i !== indexToRemove) return true;
      });

      setImageFiles([...newImageFiles]);
    }

    // Nous voulons également mettre à jour l'interface utilisateur
    const newImagesSource = productImagesSource.filter((_, i) => {
      if (i !== index) return true;
    });

    setProductImagesSource([...newImagesSource]);
  };

  // Fonction pour obtenir le titre du bouton en fonction de l'action (création ou mise à jour)
  const getBtnTitle = () => {
    if (isForUpdate)
      return isPending ? "En train de mettre à jour" : "Mise à jour";
    return isPending ? "En train de créer" : "Créer";
  };

  useEffect(() => {
    if (initialValue) {
      setProductInfo({ ...initialValue });
      setThumbnailSource([initialValue.thumbnail]);
      setProductImagesSource(initialValue.images);
      setIsForUpdate(true);
    }
    // A VERIFIER SI PROBLEME
  }, [initialValue]);
  // A VERIFIER SI PROBLEME

  // Gestionnaire de changement d'images
  const onImagesChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const files = target.files;
    if (files) {
      const newImages = Array.from(files).map((item) => item);
      const oldImages = productImagesSource || [];
      setImageFiles([...imageFiles, ...newImages]);
      setProductImagesSource([
        ...oldImages,
        ...newImages.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  // Gestionnaire de changement de l'image principale
  const onThumbnailChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const files = target.files;
    if (files) {
      const file = files[0];
      setThumbnail(file);
      setThumbnailSource([URL.createObjectURL(file)]);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="mb-2 text-xl">Ajouter un noouveau produit</h1>

      <form
        action={() =>
          startTransition(async () => {
            await onSubmit({ ...productInfo, images: imageFiles, thumbnail });
          })
        }
        className="space-y-6"
      >
        <div className="space-y-4">
          <h3>Photo principale</h3>
          <ImageSelector
            id="thumb"
            images={thumbnailSource}
            onChange={onThumbnailChange}
          />

          <h3>Photos</h3>
          <ImageSelector
            multiple
            id="images"
            images={productImagesSource}
            onRemove={removeImage}
            onChange={onImagesChange}
          />
        </div>

        <div className="relative w-full">
          <input
            value={productInfo.title}
            onChange={({ target }) =>
              setProductInfo({ ...productInfo, title: target.value })
            }
            placeholder=" "
            className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm outline-none focus:border-blue-500 transition"
          />
          <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
            Titre
          </label>
        </div>

        <div className="relative w-full">
          <textarea
            className="h-52 peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm outline-none focus:border-blue-500 transition"
            value={productInfo.description}
            onChange={({ target }) =>
              setProductInfo({ ...productInfo, description: target.value })
            }
            placeholder=" "
          />
          <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
            Description
          </label>
        </div>

        <div className="relative w-full">
          <select
            onChange={(e) => {
              const category = e.target.value;
              if (category) setProductInfo({ ...productInfo, category });
            }}
            value={productInfo.category}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-blue-500 transition bg-white"
          >
            <option value="" disabled>
              Selectionner la categorie
            </option>
            {categories.map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <div className="space-y-4 flex-1">
            <h3>Prix</h3>

            <div className="relative w-full">
              <input
                value={productInfo.mrp}
                onChange={({ target }) => {
                  const mrp = +target.value;
                  setProductInfo({ ...productInfo, mrp });
                }}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm outline-none focus:border-blue-500 transition mb-4"
              />
              <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
                EUR
              </label>
            </div>
            <div className="relative w-full">
              <input
                value={productInfo.salePrice}
                onChange={({ target }) => {
                  const salePrice = +target.value;
                  setProductInfo({ ...productInfo, salePrice });
                }}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm outline-none focus:border-blue-500 transition mb-4"
              />
              <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
                Prix soldé
              </label>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <h3>Stock</h3>

            <div className="relative w-full">
              <input
                value={productInfo.quantity}
                onChange={({ target }) => {
                  const quantity = +target.value;
                  if (!isNaN(quantity))
                    setProductInfo({ ...productInfo, quantity });
                }}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm outline-none focus:border-blue-500 transition mb-4"
              />
              <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
                Qté
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3>Mots clés</h3>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  value={field}
                  onChange={({ target }) =>
                    updateBulletPointValue(target.value, index)
                  }
                  placeholder=" "
                  className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm outline-none focus:border-blue-500 transition mb-4"
                />
                <label className="absolute left-3 top-2 text-xs text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs transition-all">
                  {`Mot cléf ${index + 1}`}
                </label>
              </div>
              {fields.length > 1 ? (
                <button
                  onClick={() => removeBulletPoint(index)}
                  type="button"
                  className="ml-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              ) : null}
            </div>
          ))}

          <button
            disabled={isPending}
            type="button"
            onClick={addMoreBulletPoints}
            className="flex items-center space-x-1 text-gray-800 ml-auto"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Ajouter plus</span>
          </button>
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium uppercase hover:bg-blue-600 disabled:opacity-50"
        >
          {getBtnTitle()}
        </button>
      </form>
    </div>
  );
}
