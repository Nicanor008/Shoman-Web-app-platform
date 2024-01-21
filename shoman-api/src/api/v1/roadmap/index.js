const express = require('express')
import { isAdmin, isMentorOrAdmin } from '../../../middlewares/auth'
import { CreateRoadmap, getAllRoadmap } from './roadmap_controller'

const router = express.Router()

router.post('/roadmap', isMentorOrAdmin, CreateRoadmap)
router.get('/roadmap', isAdmin, getAllRoadmap)

export default router
