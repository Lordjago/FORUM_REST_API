const express = require('express')

const router = express.Router();

const isAuth = require('../helper/is-auth')

const authController = require('../controllers/auth');

const { signup, login, status } = require('../helper/validator');

router.put('/signup', signup, authController.signup )

router.post('/login', login, authController.login)

router.get('/status', isAuth, authController.getStatus)

router.patch('/status', status, isAuth, authController.updateUserStatus)

module.exports = router