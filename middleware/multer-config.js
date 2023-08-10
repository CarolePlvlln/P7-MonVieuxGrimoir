// npm install --save multer
//Package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP. Utilisé ici pour pouvoir télécharger des images.
const multer = require('multer');


//Dictionnaire pour pouvoir générer l'extension du fichier.
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

//fonction "diskStorage" pour enregistrer sur disque
const storage = multer.diskStorage({
  //dossier où enregistrer fichier
  destination: (req, file, callback) => {
    //argument "null" pour dire pas d'erreur et 2eme argument nom dossier
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    //Nouveau nom fichier. on utilise les méthodes 'split' et 'join' pour supprimer les espaces et tout coller.
    const name = file.originalname.split('').join('_');
    //extension du fichier grâce au MIME_TYPE du fichier. élément du dictionaire qui correspond au MIME_TYPE du fichier envoyé par le frontend
    const extension = MIME_TYPES[file.mimetype];
    //on rappelle callback avec en arguments null pour vérifier pas d'erreur. Le nom du fichier. Un timeStamp, un point et son extension.
    callback(null, name + Date.now() + '.' + extension);
  }
});






//On exporte notre middleware. On appelle la méthode multer à laquelle on passe l'objet "storage" puis la méthode "single" pour dir
//qu'il y a qu'un fichier et qu'il s'agit de fichier image uniquement.
module.exports = multer({ storage : storage }).single('image');