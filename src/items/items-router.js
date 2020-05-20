const path = require('path')
const express = require('express')
const xss = require('xss')
const ItemsService = require('./ItemsService')
const { requireAuth } = require('../middleware/basic-auth')


const itemRouter = express.Router()
const jsonParser = express.json()

const searializeItem = item => ({
    id: item.id, 
    rating: item.rating, 
    gear_name: xss(item.gear_name), 
    features: xss(item.features), 
    comments: xss(item.comments)
})

itemRouter 
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ItemsService.getAllItems(knexInstance)
            .then(items => {
                res.json(items.map(searializeItem))
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
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
                .json(searializeItem(item))
        })
        .catch(next)
    })


itemRouter
    .route('/:item_id')
    .all(requireAuth)
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
        res.json(searializeItem(res.item))
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
    .patch(jsonParser, (req, res, next) => {
        const { rating, gear_name, features, comments } = req.body
        const itemToUpdate = { rating, gear_name, features, comments}

        const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'rating', 'gear_name', 'features'`
                }
            })
        } 

        ItemsService.updateItem(
            req.app.get('db'),
            req.params.item_id,
            itemToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = itemRouter