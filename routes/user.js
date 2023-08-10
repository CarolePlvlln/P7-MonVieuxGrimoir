const express = require('express');
const router = express.Router();

const userCtrl = require("../controllers/user");

//création des routes POST pour s'incrire ou se connecter.
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;