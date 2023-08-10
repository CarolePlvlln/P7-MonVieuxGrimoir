//Ajout package bcrypt (npm install --save bcrypt)
const bcrypt = require('bcrypt')

//importer package pour générer des tokens
const jwt = require('jsonwebtoken');

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
    console.log(req.body)
    //Méthode "findOne". On passe un objet qui servira de filtre (sélecteur) avec un champs email et la valeur transmise par le client.
    User.findOne({email: req.body.email})
    //On vérifie si l'utilisateur a été trouvé.
    .then(user=> {
        if (user ===null) {
            //Si la valeur est nulle = erreur 401 (garder un message flou pour ne pas dire si le client est enregistré ou non)
           return res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'})
        } else {
            //Méthode compare de bcrypt pour trouver le client.
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                console.log(valid)
                if (!valid) {
                  return  res.status(401).json({ message : 'Paire identifiant/mot de passe incorrecte'})
                } else {
                    return res.status(200).json({
                        userId: user._id,
                        //on appelle la fonction sign qui prend en arguments les données qu'on veut encoder dans le token (user._id), la clé secrète pour l'encodage, expiration du token.
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                }
            })
            .catch( error => {
                console.log(error)
                //errur de traitement 500
              return  res.status(500).json({error})
            })
        }
    })
    .catch( error => {
        res.status(500).json({error});
    })
};

