const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const chalk = require('chalk')
const mongoose = require('mongoose')
const cors = require('cors')

import route from './routes'
import errorHandler from './utils/errorHandler'

const app = express()
const DB = require('./config/keys').mongoUri

app.use(cors())

app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
)

app.use(bodyParser.json())

app.use(morgan('dev'))
app.use(cors())
mongoose
    .connect(DB, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        autoIndex: false,
    })
    .then(() => console.log(chalk.greenBright('connection to the database successful')))
    .catch(err => console.log(err))

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    return mongoose.connect(DB, {
        keepAlive: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
}

mongoose.connection.on('error', err => {
    console.log(`MongoDB connection error: ${err}`)
    setTimeout(connectWithRetry, 5000)
})

route(app)

app.use((req, res, next) => {
    const error = new Error('Please use /api/v1/<specific resource> to acess the API')
    error.status = 404
    next(error)
})

// default error handler
app.use((err, req, res, next) => {
    console.error(`${err.status || 500} - ${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`)
    errorHandler(err, req, res, next)
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(chalk.magenta(`🚀 server running on http://127.0.0.1:${port}`)))
