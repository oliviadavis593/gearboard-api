require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config') 
const errorHandler = require('./error-handler')
const itemRouter = require('./items/items-router')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(express.json())
app.use(cors({
    origin: '*'
}));

app.use('/api/items',itemRouter)
app.use('/api', authRouter)
app.use('/api/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(errorHandler)

module.exports = app; 