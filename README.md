"# Brad_Schiff_Complex_App" 

Etape 1 
git init -y

Etape 2
npm install express

Etape 3
on définit express avec app puis le moteur de rendu choisi (ejs)

Etape 4
installation nodemon
dans le fichier package.json
dans "scripts": {
  "watch": "nodemon nomdufichierJsprincipal(dans ce projet : app)", 
} 

Etape 5
Création de la home pour les views, User pour les models et controllers
Traitement (sanitazation and security) des inputs de la home pour les users

Etape 6 
installation mongodb et connexion db



Lancer le projet avec "npm run watch" dans le terminal



LAST ETAPE 
Deploy on Heroku
  Sur Udemy, cours Brad Schiff, section 13
  Résumé :
  Sur Heroku, dans les settings, créer deux variables tirées du fichier .env
    - CONNECTIONSTRING
    - JWTSECRET
    - Celui sur le port on l'ignore, Heroku s'en chargera tout seul
  Création à la racine du projet du fichier "Procfile"
  Dans ce dernier, écrire :
    - web: node db.js

Sending Email with sendgrid API
  Se connecter, créer un projet et récupérer la clé API
  Dans le fichier .env, ajouter la clé API à la place de "cléapisendgrid"
