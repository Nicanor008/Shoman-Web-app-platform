require('dotenv').config()

module.exports = {
    mongoUri: process.env.MONGOURIlOCAL,
    secretOrKey: process.env.SECRETKEY,
}
