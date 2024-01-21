const express = require('express')
import {
    CreateProjectController,
    GetProjectController,
    UpdateProjectController,
    DeleteProjectController,
    GetTeamProjectsController,
    GetAllProjectsController,
    FilterProjectsController,
} from './project_controllers'
import { isAdmin, isAuthenticated, isMentorOrAdmin } from '../../../middlewares/auth'

const router = express.Router()

router.post('/projects', isMentorOrAdmin, CreateProjectController)
router.get('/projects', isAuthenticated, GetTeamProjectsController)
router.get('/projects/all', isAdmin, GetAllProjectsController)
router.get('/projects/archivedorunarchived/:status', isAuthenticated, FilterProjectsController)
router.get('/projects/:projectId', isAuthenticated, GetProjectController)
router.patch('/projects/:projectId', isMentorOrAdmin, UpdateProjectController)
router.delete('/projects/:projectId', isMentorOrAdmin, DeleteProjectController)

export default router
