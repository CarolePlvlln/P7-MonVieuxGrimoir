const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config')


//Importer controllers Stuff
const stuffCtrl = require("../controllers/stuff");

//on utilise la fonction stuff du dossier controllers (routes plus claires). On ajoute "auth" sur chaque route où l'on a besoin d'être authentifié.
router.get('/', stuffCtrl.getAllBooks);
router.post('/', auth,multer,stuffCtrl.createBook);
router.put('/:id', auth,stuffCtrl.modifyBook); 
router.delete('/:id', auth,stuffCtrl.deleteBook);
router.get('/:id', stuffCtrl.getOneBook);
router.get('/bestrating',stuffCtrl.getBestRating);
router.post('/:id/rating', auth,stuffCtrl.userRatingBook);


module.exports = router;