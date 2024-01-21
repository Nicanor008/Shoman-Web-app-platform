//@ts-check
import jwt from 'jsonwebtoken'
require('dotenv').config()

const Auth = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRETKEY)
        return decoded
    } catch (error) {
        return res.status(403).json({
            message: 'Auth failed. Permission Denied',
        })
    }
}

const roleHelper = (req, res, next, role, secondaryRole) => {
    let currentUser = Auth(req, res)
    if (currentUser && (currentUser.role == role || currentUser.role == secondaryRole)) {
        req.userData = currentUser
        next()
    } else {
        return res.status(403).json({
            message: 'Auth failed. Permission Denied',
        })
    }
}
const isAuthenticated = (req, res, next) => {
    try {
        let currentUser = Auth(req, res)
        req.userData = currentUser
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed. Login to continue',
        })
    }
}

const isAdmin = (req, res, next) => {
    roleHelper(req, res, next, 'admin')
}

const isUser = (req, res, next) => {
    roleHelper(req, res, next, 'user')
}

const isMentor = (req, res, next) => {
    roleHelper(req, res, next, 'mentor')
}

// use this if the task can be accessed by both admin and mentor
const isMentorOrAdmin = (req, res, next) => {
    roleHelper(req, res, next, 'mentor', 'admin')
}

const isMentee = (req, res, next) => {
    roleHelper(req, res, next, 'mentee')
}

export { isAuthenticated, isAdmin, isUser, isMentor, isMentorOrAdmin, isMentee }
