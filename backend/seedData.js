const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log("🌱 Début du seed des données...\n");

    // ===== CRÉATION DES UTILISATEURS CITOYENS =====
    const users = [];
    const userData = [
        {
          nom: "Prestige",
          prenom: "H",
          email: "hprestige6@gmail.com",
          telephone: "+237699000000",
          cni: "CNI999",
          motDePasse: "test123",
        },
      {
        nom: "Ngouem",
        prenom: "Jean",
        email: "jean.ngouem@email.com",
        telephone: "+237691234567",
        cni: "CNI001",
        motDePasse: "user123",
      },
      {
        nom: "Tchama",
        prenom: "Marie",
        email: "marie.tchama@email.com",
        telephone: "+237692345678",
        cni: "CNI002",
        motDePasse: "user123",
      },
      {
        nom: "Zanga",
        prenom: "Paul",
        email: "paul.zanga@email.com",
        telephone: "+237693456789",
        cni: "CNI003",
        motDePasse: "user123",
      },
    ];

    for (const data of userData) {
      const motDePasseHash = await bcrypt.hash(data.motDePasse, 10);
      const user = await prisma.utilisateur.upsert({
        where: { email: data.email },
        update: {},
        create: {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          motDePasse: motDePasseHash,
          telephone: data.telephone,
          cni: data.cni,
          dateNaissance: new Date("1990-01-15"),
        },
      });
      users.push(user);
      console.log(`✅ Utilisateur créé: ${user.prenom} ${user.nom}`);
    }

    // ===== CRÉATION DES DEMANDES AVEC DOCUMENTS =====
    const typeActes = ["ACTE_NAISSANCE", "ACTE_MARIAGE", "ACTE_DECES", "CERTIFICAT_CELIBAT"];

    for (let i = 0; i < users.length; i++) {
      const typeActe = typeActes[i % typeActes.length];
      const codeUnique = `DEMANDE${Date.now()}${i}`;

      const demande = await prisma.demande.create({
        data: {
          utilisateurId: users[i].id,
          typeActe,
          statut: "EN_ATTENTE",
          codeUnique,
          donnees: {
            prenom: users[i].prenom,
            nom: users[i].nom,
            dateNaissance: users[i].dateNaissance,
            lieu: "Douala",
          },
          documents: {
            create: [
              {
                nom: "Pièce d'identité",
                url: `/uploads/${users[i].id}/cni.pdf`,
                type: "PDF",
              },
              {
                nom: "Justificatif de domicile",
                url: `/uploads/${users[i].id}/domicile.pdf`,
                type: "PDF",
              },
            ],
          },
        },
        include: { documents: true },
      });

      console.log(`✅ Demande créée pour ${users[i].prenom}: ${typeActe}`);
      console.log(`   📄 ${demande.documents.length} documents associés\n`);
    }

    // ===== CRÉATION DE L'ADMIN =====
    const codeUniqueAdmin = "ADMIN001";
    const motDePasseHash = await bcrypt.hash("admin123", 10);

    const admin = await prisma.adminMairie.upsert({
      where: { codeUnique: codeUniqueAdmin },
      update: {},
      create: {
        nom: "Dupont",
        prenom: "Admin",
        codeUnique: codeUniqueAdmin,
        motDePasse: motDePasseHash,
        role: "administrateur",
      },
    });

    console.log(`✅ Admin créé: ${admin.prenom} ${admin.nom}\n`);

    console.log("========================================");
    console.log("🎉 SEED COMPLÉTÉ AVEC SUCCÈS!");
    console.log("========================================\n");
    console.log("📋 IDENTIFIANTS DE CONNEXION:\n");
    console.log("--- CITOYENS ---");
    userData.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.motDePasse}\n`);
    });
    console.log("--- ADMIN ---");
    console.log(`Code unique: ${codeUniqueAdmin}`);
    console.log(`Password: admin123\n`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
