const Book = require('../models/Book');
const sharp = require('sharp')
const auth = require('../middleware/auth');
//fs (file système) pour pouvoir gérer les fichiers
const fs = require('fs');



exports.createBook = async (req, res, next) => {
    console.log(req.file)
    //convertir en JS
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
    /*fs.readFile(
        `${req.protocol}://${req.get("host")}/images/resized_${req.file.filename}`, {encoding: "utf8"},function (err, image) {
            if (err) {
                throw err;
            }
            console.log(image);
            res.send(image);
        })*/
    //méthode "save" pour sauvegarder le nouveau 'book' dans la base de données
    book.save()
        //Renvoi un réponse
        .then(() => { res.status(201).json({ message: 'Post saved successfully!' }) })
        //Si il y a une erreur
        .catch(error => { console.log(error); res.status(400).json({ error }) }
        )
};


exports.modifyBook = async (req, res, next) => {
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
    //chemin du fichier, redimensionner image, compresser image suivant format
    await sharp(req.file.path).resize(206, 260).png({ quality: 60 }).jpeg({ quality: 60 }).toFile(`images/resized_${req.file.filename}`)
    book.save()
        //vérifier si Id utilisateur == id du Book
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-authorisé' });
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
                res.status(401).json({ message: 'Non-authorisé' });
            } else {
                //on retire et on l'a supprime l'image du dossier 'image' grâce à "fs.unlink"
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
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
    const BestRatingBook = Book.filter({ _ratings: req.params.ratings.grade } === 5)
    /*Book.filter(({ ratings }) =>
       ratings === 5);*/
    console.log(BestRatingBook)
        .then(book => { res.status(200).json(book) })
        //Error
        .catch(error => { res.status(404).json({ error: error }) });
};



//router.post('/api/books/:id/rating', auth,stuffCtrl.userRatingBook);
exports.userRatingBook = (req, res, next) => {
    /* Book.findById({ _id: req.params.id }).exec(function (err, Book) {
         Grade.create(newGrade, function (err, rating) {
             Book.ratings.push(rating);
             Book.rating = calculateRating(Book.ratings);
             Book.save()
         })
             .then(() => { res.status(200).json({ message: 'Rating added!' }) })
 
             .catch(error => { res.status(400).json({ error }) });
     })
 */
    //convertir en JS
    const bookJS = JSON.parse(req.body.book)
    const rating = new grade({
        ratings: [{
            userId: req.auth.userId,
            grade: bookJS.ratings.grade,
        }],
        averageRating: req.body.averageRating
    });
    // Trouver comment empêcher si user déjà fait une notation.
    if (Book.count({ Book: Book._ratings, auth: user._id }) == 0) {
        rating.save()
        Book.findByIdAndUpdate({ _id: req.params.id }, {
            $push: {
                grade: grade
            }
        })
            //Trouver comment l'ajouter aux autres rating.

            .then(() => { res.status(200).json({ message: 'Rating added!' }) })

            .catch(error => { res.status(400).json({ error }) });
    } else {
        return ({ error })
    }
};



exports.getAllBooks = (req, res, next) => {
    //méthode "find()" qui rendra la liste complète
    Book.find()
        // récupère le tableau de tous les book et renvoie réponse 200 et le tableau de book
        .then(books => { res.status(200).json(books) })
        .catch(error => { res.status(400).json({ error }) });
}
