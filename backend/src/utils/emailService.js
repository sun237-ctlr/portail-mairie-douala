const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const headerHTML = (titre) => `
  <div style="background: #15803d; padding: 28px 32px; border-radius: 12px 12px 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <div style="width:36px;height:36px;background:#ffffff;border-radius:8px;display:inline-block;vertical-align:middle;text-align:center;line-height:36px;">
            <span style="color:#15803d;font-weight:bold;font-size:16px;">M</span>
          </div>
          <span style="color:white;font-size:18px;font-weight:bold;vertical-align:middle;margin-left:10px;">e-Mairie Douala</span>
        </td>
      </tr>
      <tr><td style="padding-top:4px;">
        <span style="color:#bbf7d0;font-size:13px;">Portail des actes administratifs</span>
      </td></tr>
    </table>
  </div>
`;

const footerHTML = () => `
  <div style="border-top:1px solid #e5e7eb;margin-top:32px;padding-top:20px;text-align:center;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">e-Mairie Douala — Portail des actes administratifs</p>
    <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">Communauté Urbaine de Douala — Cameroun</p>
  </div>
`;

const infoBox = (label, value, couleur = '#f0fdf4', bordure = '#86efac', texte = '#166534') => `
  <div style="background:${couleur};border:1px solid ${bordure};padding:16px 20px;border-radius:8px;margin:16px 0;">
    <p style="margin:0;font-size:13px;color:${texte};">
      <strong>${label}</strong><br/>${value}
    </p>
  </div>
`;

const envoyerEmailCodeUnique = async (email, nom, typeActe, codeUnique, qrBase64) => {
  await transporter.sendMail({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Votre code de suivi — e-Mairie Douala',
    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      ${headerHTML('Code de suivi')}
      <div style="padding:32px;">
        <p style="font-size:15px;color:#374151;margin:0 0 8px;">Bonjour <strong>${nom}</strong>,</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
          Votre demande d'<strong style="color:#111827;">${typeActe.replace(/_/g, ' ')}</strong> a été soumise avec succès et est en cours de traitement.
        </p>

        <div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:10px;padding:24px;text-align:center;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:12px;color:#166534;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Votre code de suivi unique</p>
          <p style="margin:0;font-size:36px;font-weight:bold;color:#15803d;letter-spacing:8px;font-family:monospace;">${codeUnique}</p>
        </div>

        ${qrBase64 ? `
        <div style="text-align:center;margin:24px 0;">
          <img src="${qrBase64}" alt="QR Code" width="140" height="140" style="border:4px solid #f0fdf4;border-radius:8px;" />
          <p style="font-size:12px;color:#6b7280;margin:8px 0 0;">Scannez ce QR code pour vérifier l'état de votre demande</p>
        </div>` : ''}

        ${infoBox(
          'Conservation importante',
          `Ce code vous permettra de vérifier l'état de votre demande à tout moment, même sans connexion, sur la plateforme e-Mairie Douala — rubrique "Récupérer Acte".`,
          '#fefce8', '#fde68a', '#92400e'
        )}

        <p style="font-size:13px;color:#6b7280;margin:16px 0 0;">
          Vous recevrez une notification par email dès que votre demande aura été traitée par les services de la mairie.
        </p>

        ${footerHTML()}
      </div>
    </div>
    `
  });
};

const envoyerEmailAcceptation = async (email, nom, typeActe, codeUnique, dateRdv, dateDispo) => {
  await transporter.sendMail({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Demande acceptée — e-Mairie Douala',
    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      ${headerHTML('Demande acceptée')}
      <div style="padding:32px;">
        <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
          <p style="margin:0;font-size:15px;font-weight:bold;color:#166534;">Demande acceptée</p>
          <p style="margin:4px 0 0;font-size:13px;color:#166534;">${typeActe.replace(/_/g, ' ')}</p>
        </div>

        <p style="font-size:15px;color:#374151;margin:0 0 8px;">Bonjour <strong>${nom}</strong>,</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
          Nous avons le plaisir de vous informer que votre demande d'<strong style="color:#111827;">${typeActe.replace(/_/g, ' ')}</strong> a été examinée et acceptée par les services de la mairie.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px 20px;margin:16px 0;">
          <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Code de suivi</p>
          <p style="margin:0;font-size:22px;font-weight:bold;color:#111827;font-family:monospace;letter-spacing:4px;">${codeUnique}</p>
        </div>

        ${dateRdv ? infoBox(
          'Date de rendez-vous',
          new Date(dateRdv).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }),
          '#f0fdf4', '#86efac', '#166534'
        ) : ''}

        ${dateDispo ? infoBox(
          'Acte disponible à partir du',
          new Date(dateDispo).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }),
          '#eff6ff', '#93c5fd', '#1e40af'
        ) : ''}

        <p style="font-size:13px;color:#374151;margin:16px 0;">
          Veuillez vous présenter au guichet de votre mairie d'arrondissement muni(e) de votre carte nationale d'identité originale.
        </p>

        ${footerHTML()}
      </div>
    </div>
    `
  });
};

const envoyerEmailRejet = async (email, nom, typeActe, raisonRejet) => {
  await transporter.sendMail({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Demande non retenue — e-Mairie Douala',
    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      ${headerHTML('Décision sur votre demande')}
      <div style="padding:32px;">
        <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
          <p style="margin:0;font-size:15px;font-weight:bold;color:#991b1b;">Demande non retenue</p>
          <p style="margin:4px 0 0;font-size:13px;color:#991b1b;">${typeActe.replace(/_/g, ' ')}</p>
        </div>

        <p style="font-size:15px;color:#374151;margin:0 0 8px;">Bonjour <strong>${nom}</strong>,</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
          Après examen de votre dossier, les services de la mairie n'ont pas pu donner suite à votre demande d'<strong style="color:#111827;">${typeActe.replace(/_/g, ' ')}</strong>.
        </p>

        ${infoBox('Motif de la décision', raisonRejet, '#fef2f2', '#fca5a5', '#991b1b')}

        <p style="font-size:13px;color:#374151;margin:16px 0;">
          Vous pouvez soumettre une nouvelle demande en tenant compte des éléments mentionnés ci-dessus, ou vous rapprocher de votre mairie d'arrondissement pour plus d'informations.
        </p>

        ${footerHTML()}
      </div>
    </div>
    `
  });
};
const envoyerEmailReinitialisaton = async (email, nom, lien) => {
  await transporter.sendMail({
    from: `"e-Mairie Douala" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe — e-Mairie Douala',
    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      ${headerHTML('Réinitialisation mot de passe')}
      <div style="padding:32px;">
        <p style="font-size:15px;color:#374151;margin:0 0 8px;">Bonjour <strong>${nom}</strong>,</p>
        <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
          Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
        </p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${lien}" style="background:#15803d;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        ${infoBox('Attention', 'Ce lien est valable pendant 1 heure. Si vous n\'avez pas fait cette demande, ignorez cet email.', '#fefce8', '#fde68a', '#92400e')}
        ${footerHTML()}
      </div>
    </div>
    `
  });
};

module.exports = { envoyerEmailCodeUnique, envoyerEmailAcceptation, envoyerEmailRejet, envoyerEmailReinitialisaton };
