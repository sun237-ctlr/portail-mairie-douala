const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function creerCitoyenTest() {
  try {
    const motDePasseHash = await bcrypt.hash("test123", 10);

    const citoyen = await prisma.utilisateur.create({
      data: {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@test.com",
        motDePasse: motDePasseHash,
        telephone: "0123456789",
      },
    });

    console.log("Citoyen test créé :");
    console.log("Email : jean.dupont@test.com");
    console.log("Mot de passe : test123");
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await prisma.$disconnect();
  }
}

creerCitoyenTest();
