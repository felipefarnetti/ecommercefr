// Importation des dépendances nécessaires
import { NextResponse, NextRequest } from "next/server";
const nodemailer = require("nodemailer");

// Gère les requêtes POST vers /api
export async function POST(request: NextRequest) {
  const username = process.env.MAILTRAP_USERNAME;
  const password = process.env.MAILTRAP_PASSWORD;
  const myEmail = process.env.PERSONAL_EMAIL;
  const host = process.env.HOST_EMAIL;
  const port = process.env.PORT_EMAIL;

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Crée un objet transporter pour l'envoi de courriels
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: username,
      pass: password,
    },
  });

  try {
    // Envoie le courriel
    const mail = await transporter.sendMail({
      from: myEmail,
      to: email,
      replyTo: email,
      subject: `Message de contact de la part de ${email}`,
      html: `
         <table style="width: 100%; border-collapse: collapse;">
  <tbody>
    <tr>
      <td style="width: 20%; padding: 5px; border: 1px solid #ccc;">Nom :</td>
      <td style="width: 80%; padding: 5px; border: 1px solid #ccc;">${name}</td>
    </tr>
    <tr>
      <td style="width: 20%; padding: 5px; border: 1px solid #ccc;">Email :</td>
      <td style="width: 80%; padding: 5px; border: 1px solid #ccc;">${email}</td>
    </tr>
    <tr>
      <td style="width: 20%; padding: 5px; border: 1px solid #ccc;">Message :</td>
      <td style="width: 80%; padding: 5px; border: 1px solid #ccc;">${message}</td>
    </tr>
  </tbody>
</table>
            `,
    });

    // Réponse en cas de succès
    return NextResponse.json({ message: "Succès : le courriel a été envoyé" });
  } catch (error) {
    console.log(error);
    // Réponse en cas d'erreur
    NextResponse.json(
      { message: "IMPOSSIBLE D'ENVOYER LE MESSAGE" },
      { status: 500 }
    );
  }
}
