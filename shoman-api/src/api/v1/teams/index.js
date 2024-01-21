import { Router } from 'express'
import validations from './team_validation'
import { validate, validateTeamId } from '../../../middlewares/validation'
import { createTeam, getAllTeams, getATeam, deleteTeam, addUsersToTeam, CurrentUserTeam } from './team_controllers'
import { isAuthenticated } from '../../../middlewares/auth'

const router = Router()

/**
 * team creation by admin
 * /api/v1/teams - POST
 */
router.post('/teams', validations.teamCreateRules(), validate, createTeam)

/**
 * view all teams by all users of the platform
 * /api/v1/teams?page=1&limit=10&search=wonderm - GET
 * optional query params
 */
router.get('/teams', getAllTeams)

/**
 * view a team details for the currently logged in user
 * /api/v1/teams/current-user - GET
 */
router.get('/teams/current-user', isAuthenticated, CurrentUserTeam)

/**
 * view a team
 * /api/v1/teams/:teamId - GET
 */
router.get('/teams/:teamId', validateTeamId, getATeam)

/**
 * delete a team - DELETE
 */
router.delete('/teams/:teamId', validateTeamId, deleteTeam)

/**
 * /api/v1/teams/:teamId
 * add users (mentees) <array> to a team - PUT
 * expects an array of menteeIds to be added
 */
router.patch('/teams/:teamId', validateTeamId, validations.addUsersToTeamRules(), validate, addUsersToTeam)

export default router
