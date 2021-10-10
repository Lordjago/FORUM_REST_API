const express = require('express')

const router = express.Router();

const authController = require('../controllers/auth');

const { signup, login } = require('../helper/validator');

router.put('/signup', signup, authController.signup )

router.post('/login', login, authController.login)

module.exports = router