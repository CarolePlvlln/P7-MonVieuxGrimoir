const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //On récupère le token dans le header et on divise la chaîne de caractère en un tableau avec l'espace ('') entre mot clé barer et token [1]
    try{
        const token = req.headers.authorization.split(' ')[1];
    //Décoder le token grace à la méthode "verify" de jwt. On lui passe le token et la clé secrète.
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //On récupère le userId. On ajoute cette valeur à request qui lui est transmise aux routes qui vont être appelées par la suite.
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        }; 
        next()
    } catch(error){
        console.log(error)
        res.status(401).json({error});
    }
   
}