import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import { CustomError } from '../utils/customError'
const {
    Types: { ObjectId },
} = mongoose

export const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    const errorsArray = []
    errors.array().map(error => errorsArray.push({ [error.param]: error.msg }))

    return next(new CustomError(422, 'Validation error(s): Check the following fields', errorsArray))
}

export const validateTeamId = (req, res, next) => {
    const { teamId } = req.params
    // check if the mongoose id is valid or not
    const isValidId = ObjectId.isValid(teamId) && new ObjectId(teamId).toString() === teamId
    if (isValidId) {
        return next()
    } else {
        return res.status(422).json({
            errors: {
                message: 'Ensure you enter a valid ID',
            },
        })
    }
}
