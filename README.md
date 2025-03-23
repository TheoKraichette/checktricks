CheckTricks
Description
CheckTricks est une application permettant aux utilisateurs d'apprendre, de suivre et de maîtriser des tricks de skateboard. L'application est composée de deux parties : un front-end en React.js et un back-end en Node.js/Express avec MongoDB. L'API back-end gère les utilisateurs, leur connexion, et le suivi de leur progression à travers plusieurs niveaux de compétence : Débutant, Confirmé et Expert.

Stack Technique
Frontend : React.js

Backend : Node.js, Express

Base de données : MongoDB

Authentification : JSON Web Tokens (JWT)

Installation
1. Cloner le projet
Cloner ce repository depuis GitHub :

bash
Copier
Modifier
git clone https://github.com/tonrepo/checktricks.git
cd checktricks
2. Structure du projet
Le projet est divisé en deux dossiers :

pgsql
Copier
Modifier
checktricks/
├── client/               # Frontend React
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
├── server/               # Backend Node.js/Express
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── .env
│   └── package.json
3. Installer les dépendances
Backend
Dans le dossier server, installe les dépendances du serveur Node.js :

bash
Copier
Modifier
cd server
npm install
Frontend
Dans le dossier client, installe les dépendances de l'application React.js :

bash
Copier
Modifier
cd ../client
npm install
4. Configuration des variables d'environnement
Backend (server/.env)
Crée un fichier .env dans le dossier server et ajoute les informations suivantes :

env
Copier
Modifier
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
Frontend (client/.env)
Crée un fichier .env dans le dossier client pour définir l'URL de l'API :

env
Copier
Modifier
REACT_APP_API_URL=http://localhost:5000/api
5. Démarrer le serveur
Backend
Dans le dossier server, démarre le serveur Node.js :

bash
Copier
Modifier
cd server
npm start
Ou pour un environnement de développement avec Nodemon (rechargement automatique) :

bash
Copier
Modifier
npm run dev
Frontend
Dans le dossier client, démarre l'application React.js :

bash
Copier
Modifier
cd ../client
npm start
API Endpoints
1. Utilisateurs (Auth)
Inscription
POST /api/users/register

Body :

json
Copier
Modifier
{
  "username": "Theo",
  "email": "theo@theo.com",
  "password": "coucou123"
}
Réponse :

json
Copier
Modifier
{
  "user": { "_id": "...", "username": "Theo", ... },
  "token": "jwt_token"
}
Connexion
POST /api/users/login

Body :

json
Copier
Modifier
{
  "email": "theo@theo.com",
  "password": "coucou123"
}
Réponse :

json
Copier
Modifier
{
  "user": { "_id": "...", "username": "Theo", ... },
  "token": "jwt_token"
}
2. Tricks
Récupérer les tricks par niveau
GET /api/tricks/:level

Exemple :

GET /api/tricks/Débutant

Réponse :

json
Copier
Modifier
[
  { "_id": "...", "name": "Kickflip", "difficulty": "Moyen", "level": "Débutant" },
  { "_id": "...", "name": "Ollie", "difficulty": "Facile", "level": "Débutant" }
]
Mettre à jour le statut d'un trick
PUT /api/tricks/update

Headers :

json
Copier
Modifier
Authorization: Bearer jwt_token
Body :

json
Copier
Modifier
{
  "trickId": "...",
  "status": "Maîtrisé",
  "stance": "Regular"
}
Réponse :

json
Copier
Modifier
{
  "message": "Mise à jour réussie",
  "user": { "_id": "...", "tricks": [...] }
}
Tester l'API avec Insomnia
Inscription :

Type : POST

URL : http://localhost:5000/api/users/register

Body : JSON avec username, email, password

Connexion :

Type : POST

URL : http://localhost:5000/api/users/login

Récupérer les tricks :

Type : GET

URL : http://localhost:5000/api/tricks/Debutant

Mettre à jour un trick :

Type : PUT

URL : http://localhost:5000/api/tricks/update

Headers : Authorization: Bearer [jwt_token]

Body : JSON avec trickId, status, stance

Remarques
Assurez-vous que MongoDB est en cours d'exécution sur votre serveur Node.js.

L'API est protégée par des tokens JWT pour sécuriser l'accès aux routes nécessitant une authentification.

Projet CheckTricks - 2025 