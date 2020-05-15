const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeItemsArray } = require('./items.fixtures')

describe('Items Endpoints', function() {
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

    describe.only('POST /items', () => {
        it(`creates an item, responding with 201 and the new item`, function() {
            const newItem = {
                rating: '🎸',
                gear_name: 'Test post gear_name',
                features: 'Test post features',
                comments: 'Test post comments'
            }
            return supertest(app)
                .post('/items')
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.rating).to.eql(newItem.rating)
                    expect(res.body.gear_name).to.eql(newItem.gear_name)
                    expect(res.body.features).to.eql(newItem.features)
                    expect(res.body.comments).to.eql(newItem.comments)
                    expect(res.body).to.have.property('id')
                })
        })

       const requiredFields = ['rating', 'gear_name', 'features', 'comments']

       requiredFields.forEach(field => {
           const newItem = {
               rating: 'Test rating',
               gear_name: 'Test gear_name',
               features: 'Test features',
               comments: 'Test comments'
           }

           it(`responds with 400 and an error message when '${field}' is missing`, () => {
               delete newItem[field]

               return supertest(app)
                .post('/items')
                .send(newItem)
                .expect(400, {
                    error: { message: `Missing '${field}' in request body` }
                })
           })
       })
        
    })
    
})