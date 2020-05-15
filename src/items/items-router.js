const path = require('path')
const express = require('express')
const ItemsService = require('./ItemsService')

const itemRouter = express.Router()
const jsonParser = express.json()

itemRouter 
    .route('/')
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
                .location(path.posix.join(req.originalUrl, `/${item.id}`))
                .json(item)
        })
        .catch(next)
    })


itemRouter
    .route('/:item_id')
    .all((req, res, next) => {
        ItemsService.getById(
            req.app.get('db'),
            req.params.item_id
        )
            .then(item => {
                if (!item) {
                    return res.status(404).json({
                        error: { message: `Item doesn't exist` }
                    })
                }
                res.item = item //save the item for the next middleware
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.item.id, 
            rating: res.item.rating,
            gear_name: res.item.gear_name, 
            features: res.item.features, 
            comments: res.item.comments
        })
    })
    .delete((req, res, next) => {
        ItemsService.deleteItem(
            req.app.get('db'),
            req.params.item_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = itemRouter