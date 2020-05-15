require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config') 
const ItemsService = require('../src/items/ItemsService')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors({
    origin: '*'
}));

app.get('/items', (req, res, next) => {
    const knexInstance = req.app.get('db')
    ItemsService.getAllItems(knexInstance)
        .then(items => {
            res.json(items)
        })
        .catch(next)
})

app.get('/items/:item_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    ItemsService.getById(knexInstance, req.params.item_id)
        .then(item => {
            if (!item) {
                return res.status(404).json({
                    error: { message: `Item doesn't exist` }
                })
            }
            res.json(item)
        })
        .catch(next)
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use((error, req, res, next) => {
    let response

    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error '}}
    } else {
        console.error(error)
        response = { error }
    }
    res.status(500).json(response)
})

module.exports = app; 