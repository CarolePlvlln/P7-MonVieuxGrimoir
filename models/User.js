const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
//infos à stocker dans la fonction userSchema. Ajout "uniue: true" pour eviter la création de plusieurs comptes avec la même adresse e-mail.
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});

//Eviter d'avoir plsr utilisateurs avec la même adresse e-mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);