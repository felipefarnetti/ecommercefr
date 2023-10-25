// Importation des dépendances nécessaires
import { NextResponse } from "next/server";
import crypto from "crypto";
import UserModel from "@models/userModel";
import startDb from "@lib/db";
import { ForgetPasswordRequest } from "@app/types";
import PasswordResetToken from "@models/passwordResetToken";
import { sendEmail } from "@lib/email";

export const POST = async (req: Request) => {
  try {
    // Récupération de l'adresse e-mail depuis les données de la requête
    const { email } = (await req.json()) as ForgetPasswordRequest;
    if (!email)
      return NextResponse.json(
        { error: "Adresse e-mail invalide!" },
        { status: 401 }
      );

    // Connexion à la base de données
    await startDb();

    // Recherche de l'utilisateur associé à l'adresse e-mail
    const user = await UserModel.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Utilisateur non trouvé!" },
        { status: 404 }
      );

    // Génération du jeton de réinitialisation de mot de passe et envoi du lien par e-mail

    ////// si ne marche en pas en bas faut changer
    // await PasswordResetToken.deleteOne({ user: user._id });

    await PasswordResetToken.findOneAndDelete({ user: user._id });

    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetToken.create({
      user: user._id,
      token,
    });

    // Création du lien de réinitialisation de mot de passe
    const resetPassLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    // Envoi du lien de réinitialisation par e-mail
    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "forget-password",
      linkUrl: resetPassLink,
    });

    // Message de confirmation à l'utilisateur
    return NextResponse.json({ message: "Veuillez vérifier votre e-mail." });
  } catch (error) {
    // Gestion des erreurs
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
