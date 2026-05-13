const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const codeUnique = "ADMIN001";
    const motDePasseHash = await bcrypt.hash("admin123", 10);

    const admin = await prisma.adminMairie.upsert({
      where: { codeUnique },
      update: {},
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
    console.log("Mot de passe : admin123");
  } catch (error) {
    console.error("Erreur :", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();

seedAdmin();
