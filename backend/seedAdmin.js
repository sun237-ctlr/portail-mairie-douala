const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const codeUnique = process.env.ADMIN_CODE;
    const motDePasse = process.env.ADMIN_PASSWORD;
    if (!codeUnique || !motDePasse || motDePasse.length < 12) {
      throw new Error("ADMIN_CODE et ADMIN_PASSWORD (12 caractères minimum) sont obligatoires");
    }
    const motDePasseHash = await bcrypt.hash(motDePasse, 12);

    const admin = await prisma.adminMairie.upsert({
      where: { codeUnique },
      update: { motDePasse: motDePasseHash },
      create: {
        nom: "Admin",
        prenom: "Principal",
        codeUnique,
        motDePasse: motDePasseHash,
        role: "administrateur",
      },
    });

    console.log("Admin créé ou mis à jour :");
    console.log("Code unique :", codeUnique);
    console.log("Mot de passe administrateur mis à jour depuis l'environnement");
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
