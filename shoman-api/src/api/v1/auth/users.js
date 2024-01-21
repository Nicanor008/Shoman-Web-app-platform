import express from 'express'
import { Verify } from '../../../utils/user'

const router = express.Router()

router.post('/verify-email', Verify)

export default router
