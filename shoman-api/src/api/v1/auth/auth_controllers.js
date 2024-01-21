const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../../config/keys')
const validateRegisterInput = require('../../../validations/register')
const validateLoginInput = require('../../../validations/login')
const User = require('../users/users_model')
import { sendEmail, compileEjs } from '../../../utils/email'
import { jwtVerify, jwtSignature } from '../../../validations/jwtService'

export const RegisterUser = (req, res) => {
    const domain = req.protocol + '://' + req.get('host')
    req.body.domain = domain
    const { errors, isValid } = validateRegisterInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' })
        } else {
            const newUser = new User({
                Username: req.body.Username,
                email: req.body.email,
                password: req.body.password,
                userType: req.body.role,
                stack: req.body.track,
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err
                    newUser.password = hash
                    newUser
                        .save()
                        .then(user =>
                            res.json({
                                message: 'Account created successfuly check your email to verify your email address',
                                user,
                            }),
                        )
                        .catch(err => console.log(err))
                })
            })
            const message = compileEjs({ template: 'general-template' })({
                header: 'Welcome to Shoman',
                body: `Your account has been <b> successfully created! </b>. Thank you for joining Shoman. 
                       Click on <b> "Verify" </b> to verify your email address`,
                name: req.body.Username,
                ctaText: 'Verify',
                ctaLink: `${domain}/api/v1/verify-email?token=${jwtSignature(req.body.email)}`,
            })
            sendEmail({
                html: message,
                subject: 'Verify Your Email',
                to: req.body.email,
            })
        }
    })
}

export const Login = (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const email = req.body.email
    const password = req.body.password
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ email: 'Email not found' })
        }
        if (user?.isVerified === false) {
            return res.status(404).json({ email: 'Your account has not been verified!' })
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    email: user.email,
                    Username: user.Username,
                    role: user.userType,
                }
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926,
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token,
                            user: user,
                        })
                    },
                )
            } else {
                return res.status(400).json({ password: 'Password incorrect' })
            }
        })
    })
}

export const GetAllUsers = (req, res, next) => {
    User.find(function (err, user) {
        if (err) {
            var err = new Error('error occured')
            return next(err)
        }
        res.status(200).json({
            message: 'All users retrived successfully',
            user,
        })
    })
}

// router.post('/forgot-password', (req, res) => {
export const ForgotPassword = (req, res) => {
    const domain = req.protocol + '://' + req.get('host')
    req.body.domain = domain
    const Email = req.body.email
    User.findOne({ email: Email }).then(user => {
        if (!user) {
            res.status(404).json({
                message: 'No user with that email Address exists',
            })
        } else {
            res.status(200).json({
                message: 'An email was sent to your email address Follow the instructions to reset your email',
            })
            const message = compileEjs({ template: 'general-template' })({
                header: 'Forgot Password',
                body: `We have sent you this email <b>in response to your request to reset your password on Shoman</b>.
              Please click the link below to complete your reset. If this email was sent by mistake kindly ignore`,
                ctaText: 'Reset My Password',
                ctaLink: `${domain}/api/v1/users/reset-password?token=${jwtSignature(req.body.email, Math.floor(Date.now() / 1000) + 7200)}`,
                name: user.Username,
            })
            sendEmail({
                html: message,
                subject: 'Request for password change',
                to: req.body.email,
            })
        }
    })
}

export const ResetPassword = (req, res) => {
    const domain = req.protocol + '://' + req.get('host')
    req.body.domain = domain
    const token = req.query.token
    const Email = jwtVerify(token)
    if (Email.message === 'jwt expired Not valid') {
        res.status(400).json({
            message: 'Request couldnot be completed at the moment request for password reset again',
        })
    }
    User.findOne({ email: Email }).then(user => {
        if (!user) {
            res.status(404).json({ message: 'User doesnot exist' })
        } else {
            user.password = req.body.password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err
                    user.password = hash
                    user.save()
                        .then(user => res.status(200).json({ message: 'password was changed', user }))
                        .catch(err => console.log(err))
                })
                const message = compileEjs({ template: 'general-template' })({
                    header: 'Password Change Success',
                    body: `Your password has successfully been changed</b>.
                  You can now login using your new password<b>Thank you for your continued support 😊😊</b>`,
                    ctaText: 'Login To Continue',
                    ctaLink: `${domain}/api/v1/users/login`,
                    name: user.Username,
                })
                sendEmail({
                    html: message,
                    subject: 'Your Password was successfully changed',
                    to: user.email,
                })
            })
        }
    })
}
