const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('⚠️ EMAIL_USER et/ou EMAIL_PASS non définis dans le fichier .env. Le service de messagerie ne peut pas envoyer d\'emails.');
}

transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer transporter verification failed:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});

const sendMailWithLogging = async (mailOptions) => {
  console.log('Tentative d\'envoi d\'email à :', mailOptions.to);
  console.log('Sujet :', mailOptions.subject);
  const info = await transporter.sendMail(mailOptions);
  console.log('Email envoyé. messageId :', info.messageId);
  console.log('Acceptés :', info.accepted);
  console.log('Rejetés :', info.rejected);
  console.log('Réponse SMTP :', info.response);
  return info;
};

const envoyerEmailCodeUnique = async (email, nom, typeActe, codeUnique, qrBase64) => {
  await sendMailWithLogging({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔑 Votre code de suivi — e-Mairie Douala',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803d; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🏛️ e-Mairie Douala</h1>
          <p style="margin: 4px 0 0; opacity: 0.8;">Portail des actes administratifs</p>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Votre demande d'<strong>${typeActe.replace(/_/g, ' ')}</strong> a été soumise avec succès.</p>
          
          <div style="background: #f0fdf4; border: 2px solid #86efac; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #166534;">Votre code de suivi unique</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #15803d; letter-spacing: 6px;">${codeUnique}</p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <img src="${qrBase64}" alt="QR Code" style="width: 150px; height: 150px;" />
            <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">Scannez ce QR code pour vérifier l'état de votre demande</p>
          </div>

          <div style="background: #fefce8; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-size: 13px; color: #92400e;">
              ⚠️ <strong>Conservez ce code précieusement !</strong><br/>
              Il vous permettra de vérifier l'état de votre demande même sans connexion sur :<br/>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/recuperer-acte" style="color: #15803d;">
                e-Mairie Douala — Récupérer Acte
              </a>
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">e-Mairie Douala — Portail des actes administratifs</p>
        </div>
      </div>
    `
  });
};

const envoyerEmailAcceptation = async (email, nom, typeActe, codeUnique, dateRdv, dateDispo) => {
  await sendMailWithLogging({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Votre demande a été acceptée — e-Mairie Douala',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803d; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🏛️ e-Mairie Douala</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #15803d;">✅ Demande acceptée !</h2>
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Votre demande d'<strong>${typeActe.replace(/_/g, ' ')}</strong> a été acceptée.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <p style="margin: 0 0 4px; font-size: 12px; color: #166534;">Code de suivi</p>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #15803d; letter-spacing: 4px;">${codeUnique}</p>
          </div>

          ${dateRdv ? `<div style="background: #f0fdf4; border: 1px solid #86efac; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>📅 Rendez-vous :</strong> ${new Date(dateRdv).toLocaleString('fr-FR')}</p>
          </div>` : ''}
          ${dateDispo ? `<div style="background: #eff6ff; border: 1px solid #93c5fd; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>🎉 Acte disponible à partir du :</strong> ${new Date(dateDispo).toLocaleString('fr-FR')}</p>
          </div>` : ''}
          
          <p>Présentez-vous à la mairie avec votre CNI originale.</p>
        </div>
      </div>
    `
  });
};

const envoyerEmailRejet = async (email, nom, typeActe, raisonRejet) => {
  await sendMailWithLogging({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '❌ Votre demande a été rejetée — e-Mairie Douala',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803d; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🏛️ e-Mairie Douala</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #dc2626;">❌ Demande rejetée</h2>
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Votre demande d'<strong>${typeActe.replace(/_/g, ' ')}</strong> a été rejetée.</p>
          <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;"><strong>Motif :</strong> ${raisonRejet}</p>
          </div>
          <p>Vous pouvez soumettre une nouvelle demande en corrigeant les informations.</p>
        </div>
      </div>
    `
  });
};

const envoyerEmailConfirmationDonnees = async (email, nom, typeActe, donnees, lienConfirmer, lienModifier) => {
  const donneesHtml = Object.entries(donnees).map(([key, value]) => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: 500; color: #374151;">${key.replace(/([A-Z])/g, ' $1').trim()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${value}</td>
    </tr>`
  ).join('');

  await sendMailWithLogging({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '📋 Veuillez confirmer vos informations — e-Mairie Douala',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803d; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🏛️ e-Mairie Douala</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #15803d;">📋 Confirmation de vos informations</h2>
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Veuillez vérifier les informations que vous avez fournies pour votre demande d'<strong>${typeActe.replace(/_/g, ' ')}</strong> :</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9fafb;">
            ${donneesHtml}
          </table>

          <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⚠️ <strong>Attention :</strong> Veuillez bien vérifier que toutes les informations sont correctes avant de confirmer.
            </p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <p style="margin: 0 0 12px; color: #6b7280; font-size: 14px;">Confirmez-vous ces informations ?</p>
            <div style="display: inline-block; margin-right: 12px;">
              <a href="${lienConfirmer}" style="background: #15803d; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">✅ Oui, je confirme</a>
            </div>
            <div style="display: inline-block;">
              <a href="${lienModifier}" style="background: #f97316; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">✏️ Modifier les infos</a>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">e-Mairie Douala — Portail des actes administratifs</p>
        </div>
      </div>
    `
  });
};

const envoyerEmailRendezVous = async (email, nom, typeActe, dateRendezVous, codeRecuperation) => {
  const date = new Date(dateRendezVous);
  const dateFormatee = date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const heureFormatee = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  await sendMailWithLogging({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Rendez-vous fixé — Récupération de votre acte — e-Mairie Douala',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #15803d; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">🏛️ e-Mairie Douala</h1>
        </div>
        <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #15803d;">✅ Rendez-vous confirmé !</h2>
          <p>Bonjour <strong>${nom}</strong>,</p>
          <p>Votre demande d'<strong>${typeActe.replace(/_/g, ' ')}</strong> a été traitée avec succès. Veuillez vous présenter à la mairie à la date et heure convenue ci-dessous pour récupérer votre acte.</p>
          
          <div style="background: #f0fdf4; border: 2px solid #86efac; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <div style="text-align: center;">
              <p style="margin: 0 0 4px; font-size: 13px; color: #166534;">📅 Date et heure</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #15803d;">${dateFormatee} à ${heureFormatee}</p>
            </div>
          </div>

          <div style="background: #eff6ff; border: 2px solid #93c5fd; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <div style="text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #1e40af;">Votre code de récupération</p>
              <p style="margin: 0; font-size: 28px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${codeRecuperation}</p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #3b82f6;">À présenter lors de votre visite</p>
            </div>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #92400e; font-size: 13px;">
              📍 <strong>Lieu :</strong> Mairie de Douala<br/>
              ⏰ <strong>Horaires :</strong> Lundi à vendredi, 8h00 - 16h00<br/>
              📄 <strong>Documents à apporter :</strong> CNI originale + Code de récupération
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">e-Mairie Douala — Portail des actes administratifs</p>
        </div>
      </div>
    `
  });
};

module.exports = { envoyerEmailCodeUnique, envoyerEmailAcceptation, envoyerEmailRejet, envoyerEmailConfirmationDonnees, envoyerEmailRendezVous };
