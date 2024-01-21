import { body, check } from 'express-validator'
import mongoose from 'mongoose'
import Team from './team_model'
import Tracks from '../tracks/track_model'
const User = require('../users/users_model')
const {
    Types: { ObjectId },
} = mongoose

const teamCreateRules = () => {
    return [
        body('team_name')
            .notEmpty()
            .withMessage('Team name is required')
            .trim()
            .custom(async (value, {}) => {
                const teamDoc = await Team.findOne({ team_name: value })
                if (teamDoc) {
                    return Promise.reject('Team name already taken')
                }
                return true
            }),
        body('mentorId', 'Ensure you enter a valid ID')
            .isMongoId()
            .custom(async (value, {}) => {
                const userExist = await User.findById(value)
                if (!userExist) {
                    return Promise.reject('User with the ID does not exist')
                }
                if (userExist.userType != 'mentor') {
                    return Promise.reject('Ensure the user is a mentor')
                }
                return true
            }),
        body('trackId', 'Ensure you enter a valid ID')
            .isMongoId()
            .custom(async (value, {}) => {
                const trackExist = await Tracks.findById(value)
                if (!trackExist) {
                    return Promise.reject('Track with the ID does not exist')
                }
                return true
            }),
        body('menteesId')
            .optional()
            .isArray()
            .withMessage('Expected an array')
            .custom(async (values, {}) => {
                const userExist = await User.find({ _id: { $in: values }, userType: 'mentee' })
                if (userExist.length == 0) {
                    return Promise.reject('Ensure all the menteesId are valid and of user-type "mentee"')
                }
                return true
            }),
    ]
}

const addUsersToTeamRules = () => {
    return [
        check('teamId', 'Ensure you enter a valid ID').isMongoId(), 
        body('menteesId')
            .isArray()
            .withMessage('Expected an array, mentees can not be empty')
            .custom(async (values, {}) => {
                const userExist = await User.find({ _id: { $in: values }, userType: 'mentee' })
                if (userExist.length == 0) {
                    return Promise.reject('Ensure all the menteesId are valid and of user-type "mentee"')
                }
                return true
            }),
        body('mentorId')
            .optional()
            .isMongoId()
            .withMessage('Ensure you enter a valid ID')
            .custom(async (value, {}) => {
                const userExist = await User.findOne({ _id: value, userType: 'mentor' })
                if (!userExist) {
                    return Promise.reject('Mentor with the ID does not exist')
                }
                return true
            }),
    ]
}

export default {
    teamCreateRules,
    addUsersToTeamRules,
}
