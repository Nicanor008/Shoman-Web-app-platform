const express = require('express')
import { isAuthenticated } from '../../../middlewares/auth'
import { FilterUsersByRole, GetASingleUser, LoggedInUserDetails } from './user_controller'

const router = express.Router()

router.get('/users/current-user', isAuthenticated, LoggedInUserDetails)
router.get('/users/:id', GetASingleUser)
router.get('/users/filter-by-role/:userType', FilterUsersByRole)

export default router
