//@ts-check
import express from 'express'

const router = express.Router()

export const defaultRoute = (req, res) => {
    return res.send(
        '<center><p>Welcome to <b>Shoman Mentorship Platform.</b></p><br />You can access endpoints on <i>https://shoman.herokuapp.com/api/v1/...</i> e.g. <u>https://shoman.herokuapp.com/api/v1/users/all</u></center>',
    )
}

router.get('/', defaultRoute)

export default router
