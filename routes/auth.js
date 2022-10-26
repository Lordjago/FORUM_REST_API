// const express = require('express')
import express from 'express'

const router = express.Router();

import isAuth from '../helper/is-auth.js'

import {_signup, _login, _getStatus, _updateUserStatus} from '../controllers/auth.js'

import { signup, login, status } from '../helper/validator.js'

router.post('/signup', signup, _signup )

router.post('/login', login, _login)

router.get('/status', isAuth, _getStatus)

router.patch('/status', status, isAuth, _updateUserStatus)

export default router