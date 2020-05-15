const express = require('express')
const ItemsService = require('./ItemsService')

const itemRouter = express.Router()
const jsonParser = express.json()

itemRouter 
    .route('/items')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ItemsService.getAllItems(knexInstance)
            .then(items => {
                res.json(items)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
       const { rating, gear_name, features, comments } = req.body
       const newItem = { rating, gear_name, features, comments }

       for (const [key, value] of Object.entries(newItem)) {
           if (value == null) {
               return res.status(400).json({
                   error: { message: `Missing '${key}' in request body` }
               })
           }
       }

       ItemsService.insertItems(
           req.app.get('db'),
           newItem
       )
        .then(item => {
            res
                .status(201)
                .location(`/items/${item.id}`)
                .json(item)
        })
        .catch(next)
    })


itemRouter
    .route('/items/:item_id')
    .get((req, res, next) => {
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


module.exports = itemRouter