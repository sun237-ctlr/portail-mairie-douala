const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const envoyerEmailCodeUnique = async (email, nom, typeActe, codeUnique, qrBase64) => {
  await transporter.sendMail({
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
  await transporter.sendMail({
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
  await transporter.sendMail({
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

module.exports = { envoyerEmailCodeUnique, envoyerEmailAcceptation, envoyerEmailRejet };
