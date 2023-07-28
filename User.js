//Importer Mongoose.
const mongoose = require('mongoose');

//Créer le schéma de données. Fonction Schema. On passe un objet dictant les champs dont le "thing" a besoin.
const userSchema = mongoose.Schema({
    email: { String, required: true },
    password: { type: String, Number, required: true },
});


//On exporte le modèle afin de pouvoir l'exploiter en dehors.
module.exports = mongoose.model('User', userSchema);