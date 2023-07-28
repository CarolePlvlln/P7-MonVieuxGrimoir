const express = require('espress');
const router = express.Router();
//Importer controllers Stuff
const stuffCtrl = require("./controllers/stuff");

//on utilise la fonction stuff du dossier controllers (routes plus claires).
router.post ('/', stuffCtrl.createBook)
router.put('/:id', stuffCtrl.modifyBook); 
router.delete('/:id', stuffCtrl.deleteBook);
router.get('/:id', stuffCtrl.getOneBook);
router.get('/', stuffCtrl.getAllBooks);


module.exports = router;