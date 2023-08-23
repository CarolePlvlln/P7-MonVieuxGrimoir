const Book = require('../models/Book');
const sharp = require('sharp')
const auth = require('../middleware/auth');
//fs (file système) pour pouvoir gérer les fichiers
const fs = require('fs');



exports.createBook = async (req, res, next) => {
    console.log(req.file)
    //convertir en JS
    //req.body ce qui vient du front
    const bookJS = JSON.parse(req.body.book)
    const book = new Book({
        title: bookJS.title,
        author: bookJS.author,
        //userId dans middleware auth
        userId: req.auth.userId,
        //req.protocol = requête http. "request.file.nom"
        imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${req.file.filename}`,
        genre: bookJS.genre,
        ratings: [{
            userId: req.auth.userId,
            grade: bookJS.ratings.grade,
        }],
        averageRating: bookJS.averageRating
    });
    //chemin du fichier, redimensionner image, compresser image suivant format
    await sharp(req.file.path).resize(206, 260).png({ quality: 60 }).jpeg({ quality: 60 }).toFile(`images/resized_${req.file.filename}`)
    //méthode "save" pour sauvegarder le nouveau 'book' dans la base de données
    book.save()
        //Renvoi un réponse
        .then(() => { res.status(201).json({ message: 'Post saved successfully!' }) })
        //Si il y a une erreur
        .catch(error => { console.log(error); res.status(400).json({ error }) }
        )
};

//modifier infos book et image
exports.modifyBook = (req, res, next) => {
    console.log(req.file)
    Book.findOne({ _id: req.params.id })
    //convertir en JS
    const book = new Book({
        title: req.params.title,
        author: req.params.author,
        //userId dans middleware auth
        userId: req.auth.userId,
        //req.protocol = requête http. "request.file.nom"
        imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${req.file.filename}`,
        genre: req.params.genre,
        ratings: [{
            userId: req.auth.userId,
            grade: req.params.ratings.grade,
        }],
        averageRating: req.params.averageRating
    });
    fs.unlink(`images/${filename}`, async function (err) {
        if (err) {
            return console.log(err + 'file deleted successfully')
        }
        else {
            //chemin du fichier, redimensionner image, compresser image suivant format
            await sharp(req.file.path).resize(206, 260).png({ quality: 60 }).jpeg({ quality: 60 }).toFile(`images/resized_${req.file.filename}`)
        }
    })
    book.save()
        //vérifier si Id utilisateur == id du Book
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(405).json({ message: 'Non-authorisé' });
            } else {
                //pour mettre à jour un Book dans la BD. Le 1er argument est l'objet de comparaison (id envoyé dans paramètre de requête).Le 2ème est la nouvelle version de l'ojet.
                Book.updateOne({ _id: req.params.id }, Book)
                    .then(() => { res.status(200).json({ message: 'Book updated successfully!' }) })
                    .catch(error => { res.status(400).json({ error }) })
            };
        })
        .catch(error => {
            res.status(500).json({ error })
        })
};


exports.deleteBook = (req, res, next) => {
    //Récupérer id des paramètres de route.
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(405).json({ message: 'Non-authorisé' });
            } else {
                //on retire et on l'a supprime l'image du dossier 'image' grâce à "fs.unlink"
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Book deleted !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
};

//Le front-end renvoi un ID. Pour pouvoir aller le cherche, on en a donc besoin.
exports.getOneBook = (req, res, next) => {
    //Méthode "findOne" à laquelle on passe un objet qui sera l'objet de comparaison: id = id du paramètre de requête.
    Book.findOne({ _id: req.params.id })
        //Promise
        .then(book => { res.status(200).json(book) })
        //Error
        .catch(error => { res.status(404).json({ error: error }) });
};



//router.get('/api/books/bestrating',stuffCtrl.getBestRating);
exports.getBestRating = (req, res, next) => {
    Book.find({ _id: req.params.id })
    .then(book => { 
        if (book.averageRating === 5) {
            res.status(200).json({ message: 'Best books rated' });
                return (book)
        }}) 
        .catch(error => { res.status(404).json({ error: error }) })
    }
        
        //Error
        
    //const BestRatingBook = Book.filter({ _ratings: req.params.averageRating } === 5)
    /*Book.filter(({ ratings }) =>
       ratings === 5);*/
    //console.log(BestRatingBook)




//router.post('/api/books/:id/rating', auth,stuffCtrl.userRatingBook);
exports.userRatingBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            //fonction find
            if (book.ratings.find(rating => rating.userId === req.auth.userId)) {
                //405 non autorisé
                return res.status(405).json({ error: "You already added rating" })
            } else {
                book.ratings.push({ userId: req.auth.userId, grade: req.body.rating })
                /*méthode reduce  acc (garde en mémoire ce qu'on met dans la fonction). Méthode reduce prend argument acc (accumulateur) et 
                rating. Prend en argument ce qui a été accumulé (acc) et rating puis d'où on commence à compter (0). On divise par la longueur 
                du tabeau rating*/
                let average = book.ratings.reduce((acc, rating) =>
                    acc + rating, 0) / book.ratings.length
                //limiter les chiffres après virgule
                average = average.toFixed(1)
                //ajouter la nouvelle moyenne au livre
                book.averageRating = average
                book.save()
                return book.save()
            }
        })
        .then(book => res.status(200).json(book))
        //Error
        .catch(error => { res.status(404).json({ error: error }) });
}



exports.getAllBooks = (req, res, next) => {
    //méthode "find()" qui rendra la liste complète
    Book.find()
        // récupère le tableau de tous les book et renvoie réponse 200 et le tableau de book
        .then(books => { res.status(200).json(books) })
        .catch(error => { res.status(400).json({ error }) });
}
