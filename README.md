# Portail e-Mairie de Douala

Application web permettant aux citoyens de demander et suivre des actes administratifs, et aux agents municipaux de traiter ces demandes.

## Architecture

- `frontend/` : React 19, Vite, Tailwind CSS
- `backend/` : Node.js, Express, Prisma, PostgreSQL
- Authentification JWT, emails Nodemailer, QR codes et assistant Groq optionnel

## Démarrage local

1. Copier `backend/.env.example` vers `backend/.env` et renseigner les secrets.
2. Copier `frontend/.env.example` vers `frontend/.env`.
3. Dans `backend/`, lancer `npm ci`, `npm run db:push`, puis `npm run dev`.
4. Dans `frontend/`, lancer `npm ci`, puis `npm run dev`.

Ne jamais versionner `.env`, les documents citoyens ou les identifiants administrateur.

## Vérifications

- Backend : `npm run check`
- Frontend : `npm run lint` puis `npm run build`

## Déploiement

Le backend dispose d'un Blueprint `backend/render.yaml`. Les variables PostgreSQL, frontend, email et Groq doivent être renseignées dans Render. Le frontend nécessite `VITE_API_URL`, par exemple `https://api.example.com/api`.

Hors Docker, `backend/uploads` est un stockage local de développement. La stack Compose monte un volume persistant dédié à ce répertoire.

## Déploiement VPS avec Docker Compose

Le dépôt contient une stack autonome avec PostgreSQL, l'API Express et le frontend Nginx. Les données PostgreSQL et les uploads sont conservés dans des volumes Docker.

Sur un VPS Ubuntu avec Docker et le plugin Docker Compose :

```bash
git clone https://github.com/sun237-ctlr/portail-mairie-douala.git
cd portail-mairie-douala
cp .env.docker.example .env
nano .env
docker compose up -d --build
docker compose ps
```

Dans `.env`, définir au minimum `PUBLIC_URL` avec l'adresse publique du serveur, sans slash final. Exemple : `http://203.0.113.10`. Changer également les mots de passe proposés avant une ouverture publique.

L'application devient accessible sur `http://ADRESSE_DU_VPS`. Le compte administrateur utilise `ADMIN_CODE` et `ADMIN_PASSWORD` du fichier `.env`.

Commandes utiles :

```bash
# Consulter les journaux
docker compose logs -f

# Reconstruire après une mise à jour
git pull
docker compose up -d --build

# Arrêter sans supprimer les données
docker compose down

# Sauvegarder PostgreSQL
docker compose exec -T database pg_dump -U portail_mairie portail_mairie > sauvegarde.sql
```

Ne pas lancer `docker compose down -v`, car l'option `-v` supprime la base et les uploads persistants.
