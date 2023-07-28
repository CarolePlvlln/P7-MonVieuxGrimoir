// On importe express
const express = require('express');
const bodyParser = require('body-parser');

const stuffRoutes = require('./Route/stuff');
//const User = require("./connexion/User");

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://<pelvillaincarole>:<Espagne8>@cluster0.f7i0buy.mongodb.net/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// constante app qui sera l'application
const app = express();
//intersepter toutes les requête avec content-type json et mettre à dispo le contenu sur l'objet requête dans rec.body.
app.use(express.json());

//Enregistrer le routeur pour toutes les demandes effectuées vers /api/stuff
app.use('/api/stuff', stuffRoutes);

//headers pour permettre :d'accéder à notre API depuis n'importe quelle origine ( '*' ),
app.use((req, res, next) => {
    //d'accéder à notre API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Origin', '*');
    //d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.listen('/api/stuff', stuffRoutes);

// on exporte l'application pour pouvoir y accéder en depuis les autres fichiers du projet notamment le server Node.
module.exports = app;
