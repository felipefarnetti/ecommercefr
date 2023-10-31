// Importation des dépendances nécessaires
import { NextResponse } from "next/server";
import crypto from "crypto";
import { NewUserRequest } from "@app/types";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import EmailVerificationToken from "@models/emailVerificationToken";
import { sendEmail } from "@lib/email";

export const POST = async (req: Request) => {
  // Récupération des données de la requête
  const body = (await req.json()) as NewUserRequest;

  // Connexion à la base de données
  await startDb();

  // Création d'un nouvel utilisateur dans la base de données
  const newUser = await UserModel.create({
    ...body,
  });

  // Génération d'un jeton de vérification d'e-mail
  const token = crypto.randomBytes(36).toString("hex");

  // Création d'un jeton de vérification d'e-mail associé à l'utilisateur
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  // Création de l'URL de vérification d'e-mail
  const verificationUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;

  // Envoi d'un e-mail de vérification à l'utilisateur
  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "vérification",
    linkUrl: verificationUrl,
  });

  // Réponse de succès
  return NextResponse.json({
    message:
      "Votre e-mail doit être vérifié. Veuillez vérifier votre boîte de réception",
  });
};
