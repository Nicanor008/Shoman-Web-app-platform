const mongodb = require('mongodb')

import { CustomError } from '../../../utils/customError'
import User from './users_model'

export async function LoggedInUserDetails(req, res, next) {
    try {
        const userId = new mongodb.ObjectId(req.userData.id)
        const userDetails = await User.findById(userId)
        if (!userDetails) {
            return next(new CustomError(404, 'No Details for the current user'))
        }
        return res.status(200).json({
            status: 'success',
            message: 'Current User Details',
            data: userDetails,
        })
    } catch (error) {
        return next(CustomError(error))
    }
}

// get one user
export async function GetASingleUser(req, res, next) {
    try {
        const userId = new mongodb.ObjectId(req.params.id)
        const user = await User.findById(userId)
        if (!user) {
            return next(new CustomError(404, 'User with id  ' + userId + " Doesn't exists"))
        }
        return res.status(200).json({
            status: 'success',
            message: 'User Details',
            data: user,
        })
    } catch (error) {
        return next(CustomError(error))
    }
}

// filter users by type/role
export async function FilterUsersByRole(req, res, next) {
    try {
        const { userType } = req.params
        const filteredUsers = await User.find({ userType })
        if (!filteredUsers || filteredUsers.length === 0) {
            return res.status(404).json({
                status: 'success',
                message: `No user(s) of type ${userType}`,
            })
        }
        return res.status(200).json({
            status: 'success',
            message: `${filteredUsers.length} ${userType} found`,
            data: filteredUsers,
        })
    } catch (error) {
        return next(CustomError(error))
    }
}
