const express = require('express')
import { CreateTrackController, GetTrackController } from './track_controllers'

const router = express.Router()

router.post('/tracks', CreateTrackController)
router.get('/tracks', GetTrackController)

export default router
