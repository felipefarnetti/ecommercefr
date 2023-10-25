// Importation des dépendances nécessaires
import startDb from "@lib/db";
import { UpdatePasswordRequest } from "@app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import PasswordResetToken from "@models/passwordResetToken";
import UserModel from "@models/userModel";
import { sendEmail } from "@lib/email";

export const POST = async (req: Request) => {
  try {
    // Récupération des données de la requête (mot de passe, jeton et ID utilisateur)
    const { password, token, userId } =
      (await req.json()) as UpdatePasswordRequest;

    // Vérification de la présence du mot de passe, du jeton et de l'ID utilisateur
    if (!password || !token || !isValidObjectId(userId))
      return NextResponse.json({ error: "Requête invalide!" }, { status: 401 });

    // Connexion à la base de données
    await startDb();

    // Recherche du jeton de réinitialisation associé à l'ID utilisateur
    const resetToken = await PasswordResetToken.findOne({ user: userId });

    // Vérification de l'existence du jeton
    if (!resetToken)
      return NextResponse.json(
        { error: "Requête non autorisée!" },
        { status: 401 }
      );

    // Vérification de la correspondance du jeton
    const matched = await resetToken.compareToken(token);
    if (!matched)
      return NextResponse.json(
        { error: "Requête non autorisée!" },
        { status: 401 }
      );

    // Recherche de l'utilisateur par ID
    const user = await UserModel.findById(userId);

    // Vérification de l'existence de l'utilisateur
    if (!user)
      return NextResponse.json(
        { error: "Utilisateur non trouvé!" },
        { status: 404 }
      );

    // Vérification que le nouveau mot de passe est différent du mot de passe actuel
    const isMatched = await user.comparePassword(password);
    if (isMatched) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit être différent" },
        { status: 401 }
      );
    }

    // Mise à jour du mot de passe de l'utilisateur
    user.password = password;
    await user.save();

    // Suppression du jeton de réinitialisation utilisé
    await PasswordResetToken.findByIdAndDelete(resetToken._id);

    // Envoi d'un e-mail de confirmation de changement de mot de passe
    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "password-changed",
    });

    // Réponse de succès
    return NextResponse.json({
      message: "Votre mot de passe a été modifié avec succès.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Impossible de mettre à jour le mot de passe, une erreur est survenue !",
      },
      { status: 500 }
    );
  }
};
