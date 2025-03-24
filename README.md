# CheckTricks

CheckTricks est une application permettant aux utilisateurs d'apprendre, de suivre et de maîtriser des tricks de skateboard. L'application est composée d'un front-end en React.js et d'un back-end en Node.js/Express avec MongoDB.

## 🚀 Stack Technique

- **Frontend** : React.js
- **Backend** : Node.js, Express
- **Base de données** : MongoDB
- **Authentification** : JSON Web Tokens (JWT)

---

## 📥 Installation

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/TheoKraichette/checktricks.git
cd checktricks
```

### 2️⃣ Structure du projet
```bash
checktricks/
├── client/               # Frontend React
│   ├── public/
│   ├── src/
│       ├──assets/
│       ├──components/
│       ├──context/
│       ├──pages/
│       ├──services/
│   ├──App.jsx
│   ├──main.jsx
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
```

### 3️⃣ Installer les dépendances

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 4️⃣ Configuration des variables d'environnement

#### Backend (server/.env)
Créer un fichier `.env` et ajouter les informations suivantes :
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5️⃣ Démarrer l'application

#### Backend
```bash
cd server
npm start
```
Ou en mode développement avec Nodemon :
```bash
npm run dev
```

#### Frontend
```bash
cd ../client
npm run dev
```

---

## 📡 API Endpoints

### 1️⃣ Utilisateurs (Auth)

#### 🔹 Inscription
**POST** `/api/users/register`

**Body** :
```json
{
  "username": "Theo",
  "email": "theo@theo.com",
  "password": "coucou123"
}
```

**Réponse** :
```json
{
  "user": { "_id": "...", "username": "Theo", ... },
  "token": "jwt_token"
}
```

#### 🔹 Connexion
**POST** `/api/users/login`

**Body** :
```json
{
  "email": "theo@theo.com",
  "password": "coucou123"
}
```

**Réponse** :
```json
{
  "user": { "_id": "...", "username": "Theo", ... },
  "token": "jwt_token"
}
```

### 2️⃣ Tricks

#### 🔹 Récupérer les tricks par niveau
**GET** `/api/tricks/:level`

**Exemple** :
```bash
GET /api/tricks/Débutant
```

**Réponse** :
```json
[
  { "_id": "...", "name": "Kickflip", "difficulty": "Moyen", "level": "Débutant" },
  { "_id": "...", "name": "Ollie", "difficulty": "Facile", "level": "Débutant" }
]
```

#### 🔹 Ajouter ou mettre à jour un trick

**POST** `/api/tricks/add`

Si un utilisateur ajoute un trick pour la première fois, il doit utiliser la méthode `POST` pour l'ajouter à sa liste.

**PUT** `/api/tricks/update`

Si un utilisateur souhaite modifier un trick qu'il a déjà ajouté (ex: mettre à jour son statut ou sa stance), il doit utiliser la méthode `PUT`.

**Headers** :
```json
Authorization: Bearer jwt_token
```

**Body** :
```json
{
  "trickId": "...",
  "status": "Maîtrisé",
  "stance": "Regular"
}
```

**Réponse** :
```json
{
  "message": "Mise à jour réussie",
  "user": { "_id": "...", "tricks": [...] }
}
```

---

## 🛠 Tester l'API avec Insomnia/Postman

🔹 **Inscription** :
- Type : `POST`
- URL : `http://localhost:5000/api/users/register`
- Body : JSON avec `username`, `email`, `password`

🔹 **Connexion** :
- Type : `POST`
- URL : `http://localhost:5000/api/users/login`

🔹 **Récupérer les tricks** :
- Type : `GET`
- URL : `http://localhost:5000/api/tricks/Debutant`

🔹 **Ajouter un trick** :
- Type : `POST`
- URL : `http://localhost:5000/api/tricks/add`
- Headers : `Authorization: Bearer [jwt_token]`
- Body : JSON avec les détails du trick

🔹 **Mettre à jour un trick** :
- Type : `PUT`
- URL : `http://localhost:5000/api/tricks/update`
- Headers : `Authorization: Bearer [jwt_token]`
- Body : JSON avec `trickId`, `status`, `stance`

---

## 🔥 Remarques

✅ Assurez-vous que **MongoDB** est en cours d'exécution sur votre serveur Node.js.

✅ L'API est protégée par des tokens **JWT** pour sécuriser l'accès aux routes nécessitant une authentification.

✅ Ce projet est destiné à tous les passionnés de skateboard souhaitant suivre leur progression facilement ! 🛹🔥

---