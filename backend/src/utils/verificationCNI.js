const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const verifierCNI = async (cheminFichier) => {
  try {
    const imageBuffer = fs.readFileSync(cheminFichier);
    const base64Image = imageBuffer.toString('base64');
    const extension = path.extname(cheminFichier).toLowerCase();

    let mimeType = 'image/jpeg';
    if (extension === '.png') mimeType = 'image/png';
    else if (extension === '.pdf') {
      return {
        valide: false,
        message: 'Veuillez fournir une photo ou scan de votre CNI en format JPG ou PNG, pas un PDF.'
      };
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            },
            {
              type: 'text',
              text: `Tu es un système de vérification de documents d'identité.

Analyse cette image et réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après:
{"estDocument": true/false, "estIdentite": true/false, "lisible": true/false, "raison": "description courte"}

Règles strictes:
- estDocument: true SEULEMENT si l'image montre clairement un document physique (carte, papier officiel)
- estIdentite: true SEULEMENT si c'est une carte d'identité, passeport, ou document d'identité officiel avec photo et nom visible
- lisible: true si le texte et la photo sont clairement visibles
- raison: explique brièvement ce que tu vois

Si l'image montre une personne, un paysage, un objet, une capture d'écran d'ordinateur, un animal, ou tout autre chose qui n'est PAS un document d'identité physique, mets estDocument: false et estIdentite: false.`
            }
          ]
        }
      ]
    });

    const texte = response.choices[0].message.content.trim();
    console.log('Réponse IA CNI:', texte);

    const jsonMatch = texte.match(/\{[^{}]*\}/);
    if (!jsonMatch) {
      console.log('Pas de JSON trouvé dans la réponse IA');
      return { valide: false, message: 'Impossible de vérifier le document. Veuillez fournir une photo claire de votre CNI.' };
    }

    const resultat = JSON.parse(jsonMatch[0]);
    console.log('Résultat vérification CNI:', resultat);

    if (!resultat.estDocument) {
      return {
        valide: false,
        message: `Le document fourni ne semble pas être un document officiel. ${resultat.raison || ''} Veuillez photographier votre Carte Nationale d'Identité.`
      };
    }

    if (!resultat.estIdentite) {
      return {
        valide: false,
        message: `Le document fourni ne semble pas être une pièce d'identité. ${resultat.raison || ''} Veuillez fournir votre CNI ou passeport.`
      };
    }

    if (!resultat.lisible) {
      return {
        valide: false,
        message: 'Votre CNI est illisible ou trop floue. Veuillez reprendre la photo dans un endroit bien éclairé.'
      };
    }

    return { valide: true, message: 'CNI vérifiée avec succès' };

  } catch (error) {
    console.error('Erreur vérification CNI:', error.message);
    return {
      valide: false,
      message: 'Erreur lors de la vérification du document. Veuillez réessayer.'
    };
  }
};

module.exports = { verifierCNI };
