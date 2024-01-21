const express = require('express')

const { RegisterUser, Login, GetAllUsers, ForgotPassword, ResetPassword } = require('./auth_controllers')
import { isAuthenticated } from '../../../middlewares/auth'
const router = express.Router()

// auth
router.post('/users/register', RegisterUser)
router.post('/users/login', Login)
router.post('/users/forgot-password', ForgotPassword)
router.put('/users/reset-password', ResetPassword)

// users
router.get('/users/all', GetAllUsers)

export default router
