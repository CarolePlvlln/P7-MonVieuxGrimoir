//Ajout package bcrypt (npm install --save bcrypt)
const bcrypt = require('bcrypt')

const User = require('../models/User');

exports.signup = (req, res, next) => {
    // fonction pour crympter le mot de passe. On passe le MP du corps de la requête + 10 tour de l'algorythme.
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //création nouvelle utilisateur. On passe l'adresse fournie dans le corsp de la requête et le mot de passe crypté.
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur crée !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res, next) => {

};

