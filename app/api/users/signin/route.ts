// Importation des dépendances nécessaires
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { SignInCredentials } from "@app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  // Récupération des données d'authentification (e-mail et mot de passe) depuis la requête
  const { email, password } = (await req.json()) as SignInCredentials;

  // Vérification de la présence de l'e-mail et du mot de passe
  if (!email || !password)
    return NextResponse.json({
      error: "E-mail ou mot de passe manquant!",
    });

  // Connexion à la base de données
  await startDb();

  // Conversion de l'e-mail fourni en minuscules (ou majuscules)
  const lowerCaseEmail = email.toLowerCase();

  // Recherche de l'utilisateur en utilisant l'e-mail en minuscules
  const user = await UserModel.findOne({ email: lowerCaseEmail });

  // Vérification de l'existence de l'utilisateur
  if (!user)
    return NextResponse.json({
      error: "E-mail ou mot de passe incorrect!",
    });

  // Vérification de la correspondance du mot de passe
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch)
    return NextResponse.json({
      error: "E-mail ou mot de passe incorrect!",
    });

  // Réponse avec les informations de l'utilisateur en cas d'authentification réussie
  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      avatar: user.avatar?.url,
    },
  });
};
