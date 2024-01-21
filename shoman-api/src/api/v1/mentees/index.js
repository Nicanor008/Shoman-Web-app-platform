import { Router } from 'express'
import validations from './mentee_validation'
import { validate } from '../../../middlewares/validation'
import { applyForMentorship, GetAllApplicants } from './mentee_controllers'
import { isAdmin } from '../../../middlewares/auth'

const router = Router()

/**
 * mentorship application for mentee
 */
router.post('/mentees/apply', validations.menteeApplyRules(), validate, applyForMentorship)
router.get('/mentees/applications', isAdmin, GetAllApplicants)

export default router
