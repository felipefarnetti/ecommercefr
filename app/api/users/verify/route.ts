// Importation des dépendances nécessaires
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import crypto from "crypto";

import EmailVerificationToken from "@models/emailVerificationToken";
import UserModel from "@models/userModel";
import { EmailVerifyRequest } from "@app/types";
import { sendEmail } from "@lib/email";
import startDb from "@lib/db";

export const POST = async (req: Request) => {
  try {
    // Récupération des données de la requête (ID utilisateur et jeton de vérification)
    const { userId, token } = (await req.json()) as EmailVerifyRequest;

    // Vérification de la validité de l'ID utilisateur et du jeton
    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        {
          error: "Requête invalide, l'ID utilisateur et le jeton sont requis!",
        },
        { status: 401 }
      );
    }

    // Recherche du jeton de vérification d'e-mail associé à l'ID utilisateur
    const verificationToken = await EmailVerificationToken.findOne({
      user: userId,
    });

    // Vérification de l'existence du jeton de vérification
    if (!verificationToken) {
      return NextResponse.json(
        {
          error: "Jeton invalide",
        },
        { status: 401 }
      );
    }

    // Vérification de la correspondance du jeton
    const isMatched = await verificationToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        {
          error: "Requête invalide, le jeton ne correspond pas",
        },
        { status: 401 }
      );
    }

    // Marquer l'utilisateur comme vérifié
    await UserModel.findByIdAndUpdate(userId, { verified: true });

    // Suppression du jeton de vérification utilisé
    await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

    // Réponse de succès
    return NextResponse.json(
      { message: "Votre e-mail est vérifié" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Impossible de vérifier votre e-mail, une erreur est survenue!",
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: Request) => {
  try {
    // Récupération de l'ID utilisateur à partir de l'URL
    const userId = req.url.split("?userId=")[1];

    // Vérification de la validité de l'ID utilisateur
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Requête invalide, ID utilisateur manquant!" },
        { status: 401 }
      );
    }

    // Connexion à la base de données
    await startDb();

    // Recherche de l'utilisateur par ID
    const user = await UserModel.findById(userId);

    // Vérification de l'existence de l'utilisateur
    if (!user) {
      return NextResponse.json(
        { error: "Requête invalide, utilisateur introuvable!" },
        { status: 401 }
      );
    }

    // Vérification de l'état de vérification de l'utilisateur
    if (user.verified) {
      return NextResponse.json(
        { error: "Requête invalide, utilisateur déjà vérifié!" },
        { status: 401 }
      );
    }

    // Génération d'un nouveau jeton de vérification
    const token = crypto.randomBytes(36).toString("hex");

    // Suppression de tout jeton de vérification existant associé à l'ID utilisateur
    await EmailVerificationToken.findOneAndDelete({ user: userId });

    // Création d'un nouveau jeton de vérification
    await EmailVerificationToken.create({
      user: userId,
      token,
    });

    // Création de l'URL de vérification d'e-mail
    const verificationUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${userId}`;

    // Envoi d'un e-mail de vérification à l'utilisateur
    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "verification",
      linkUrl: verificationUrl,
    });

    // Réponse de succès
    return NextResponse.json(
      { message: "Veuillez vérifier votre e-mail" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Impossible de vérifier votre e-mail, une erreur est survenue!",
      },
      { status: 500 }
    );
  }
};
