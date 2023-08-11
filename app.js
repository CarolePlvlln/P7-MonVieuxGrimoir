// On importe express
const express = require('express');
//body-parser extrait la partie entière du body dans la requête et l'expose sur req.body.
const bodyParser = require('body-parser');
//Importation des fichiers routes stuff et user.
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');
//chemin pour images
const path = require("path");

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pelvillaincarole:Espagne8@cluster0.f7i0buy.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log(error));

// constante app qui sera l'application
const app = express();
//intersepter toutes les requête avec content-type json et mettre à dispo le contenu sur l'objet requête dans rec.body.
app.use(express.json());


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

//Informe le système que l'on veut utiliser du json
app.use(bodyParser.json());
//route livres
app.use('/api/books', stuffRoutes);
//route authentification
app.use ('/api/auth', userRoutes);
//route images (dirname: chemin courant)
app.use("/images", express.static(path.join(__dirname, "images")));


// on exporte l'application pour pouvoir y accéder en depuis les autres fichiers du projet notamment le server Node.
module.exports = app;
