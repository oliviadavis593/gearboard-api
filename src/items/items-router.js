const express = require('express')
const ItemsService = require('./ItemsService')
const itemRouter = express.Router()


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