//Importer Mongoose.
const mongoose = require('mongoose');


//Créer le schéma de données. Fonction Schema. On passe un objet dictant les champs dont le "thing" a besoin.
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    filename: { type: String, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String },
        grade: { type: String },
    }],
    averageRating : { type: Number, required: true },
});


//On exporte le modèle afin de pouvoir l'exploiter en dehors.
module.exports = mongoose.model('Book', bookSchema);