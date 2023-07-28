const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
    delete req.body._id;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        genre: req.body.genre,
        ratings: [{
            userId: req.body.userId,
            grade: req.body.grade,
        }],
        averageRating: req.body.averageRating
    });
    //méthode "save" pour sauvegarder le nouveau 'book' dans la base de données
    book.save()
        //Renvoi un réponse
        .then(() => { res.status(201).json({ message: 'Post saved successfully!' }) })
        //Si il y a une erreur
        .catch(error => { res.status(400).json({ error }) }
        )
};

exports.modifyBook = (req, res, next) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        genre: req.body.genre,
        ratings: [{
            userId: req.body.userId,
            grade: req.body.grade,
        }],
        averageRating: req.body.averageRating
    });
    //pour mettre à jour un Book dans la BD. Le 1er argument est l'objet de comparaison (id envoyé dans paramètre de requête).Le 2ème est la nouvelle version de l'ojet.
    Book.updateOne({ _id: req.params.id },Book)
      .then(() => {res.status(200).json({ message: 'Book updated successfully!'})})
      .catch(error => {res.status(400).json({ error })});
  };

  exports.deleteBook = (req, res, next) => {
    //Récupérer id des paramètres de route.
    Book.deleteOne({ _id: req.params.id })
      .then(() => {res.status(200).json({ message: 'Livre supprimé !'})})
      .catch(error => {res.status(400).json({ error })});
  };

  //Le front-end renvoi un ID. Pour pouvoir aller le cherche, on en a donc besoin.
  exports.getOneBook = (req, res, next) => {
    //Méthode "findOne" à laquelle on passe un objet qui sera l'objet de comparaison: id = id du paramètre de requête.
    Book.findOne({ _id: req.params.id })
      //Promise
      .then(book => {res.status(200).json(book)})
      //Error
      .catch(error => {res.status(404).json({ error: error })});
  };

  exports.getAllBooks = (req, res, next) => {
    //méthode "find()" qui rendra la liste complète
    Book.find()
    // récupère le tableau de tous les book et renvoie réponse 200 et le tableau de book
    .then(books => {res.status(200).json(books)})
    .catch(error => {res.status(400).json({error})});
};