const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const SYSTEM_PROMPT = `Tu es un assistant virtuel de la Mairie de Douala, Cameroun.
Tu aides les citoyens avec leurs demandes d'actes administratifs.
Tu réponds en français, de manière claire, courte et bienveillante.
Tu connais ces 10 actes : Acte de naissance, Acte de mariage, Acte de décès,
Certificat de résidence, Certificat de vie, Certificat de célibat,
Légalisation de documents, Attestation de domicile,
Certificat de nationalité, Autorisation parentale.
Pour chaque acte tu connais les documents requis.
Si on te pose une question hors sujet, redirige poliment vers les services de la mairie.
Ne donne jamais de fausses informations. Sois toujours professionnel.`;

router.post("/chat", async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      // Mode démo : réponse mockée
      const mockResponses = [
        "Bonjour ! Je suis l'assistant virtuel de la Mairie de Douala. Pour une demande d'acte de naissance, vous devez fournir votre CNI et un justificatif de domicile.",
        "Pour un acte de mariage, veuillez vous présenter à la mairie avec vos pièces d'identité et les témoins.",
        "Les actes disponibles sont : naissance, mariage, décès, résidence, vie, célibat, légalisation, domicile, nationalité, parentale.",
        "Pour récupérer un acte, utilisez le code unique fourni lors de votre demande.",
      ];
      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];
      return res.json({ message: randomResponse });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { messages } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur IA", error: error.message });
  }
});

module.exports = router;
