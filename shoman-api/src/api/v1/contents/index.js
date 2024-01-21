import { Router } from 'express'
import validations from './content_validation'
import { isAuthenticated, isMentorOrAdmin, isAdmin } from '../../../middlewares/auth'
import { validate } from '../../../middlewares/validation'
import { createContent, getAllContents, getContent, deleteContent, updateContent } from './content_controllers'

const router = Router()

/**
 * view all teams by all users of the platform
 * /api/v1/contents?page=1&limit=10&search=howtoget started with html - GET
 * optional query params
 */
router.get('/contents', isAuthenticated, getAllContents)

/**
 * create learning content by a mentor or admin
 * /api/v1/contents - POST
 */
router.post('/contents', isMentorOrAdmin, validations.createContentRules(), validate, createContent)

/**
 * view a learning content
 * /api/v1/contents/:contentId - GET
 */
router.get('/contents/:contentId', isAuthenticated, getContent)

/**
 * delete content - DELETE by admin
 */
router.delete('/contents/:contentId', isMentorOrAdmin, deleteContent)

/**
 * update content - PATCH by admin or aurhor
 */
router.patch('/contents/:contentId', isMentorOrAdmin, updateContent)

export default router
