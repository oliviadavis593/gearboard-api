const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeItemsArray } = require('./items.fixtures')

describe.only('Items Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('gearboard_items').truncate())

    afterEach('cleanup', () => db('gearboard_items').truncate())

    describe('GET /items', () => {
        context('Given there are items in the database', () => {
            const testItems = makeItemsArray()
    
            beforeEach('insert items', () => {
                return db 
                    .into('gearboard_items')
                    .insert(testItems)
            })
    
            it('GET /items responds with 200 and all of the items', () => {
                return supertest(app)
                    .get('/items')
                    .expect(200, testItems)
            })
        })

        context('Given no items', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/items')
                    .expect(200, [])
            })
        })
    })

    describe('GET /items/:item_id', () => {
        context('Given there are articles in the database', () => {
            const testItems = makeItemsArray()

            beforeEach('insert items', () => {
                return db 
                    .into('gearboard_items')
                    .insert(testItems)
            })

            it('GET /items/:item_id responds with 200 and the specified item', () => {
                const itemId = 2
                const expectedItem = testItems[itemId - 1]
                return supertest(app)
                    .get(`/items/${itemId}`)
                    .expect(200, expectedItem)
            })
        })

        context(`Given no items`, () => {
            it(`responds with 404`, () => {
                const itemId = 123456
                return supertest(app)
                    .get(`/items/${itemId}`)
                    .expect(404, { error: { message: `Item doesn't exist` } })
            })
        })
    })
    
})