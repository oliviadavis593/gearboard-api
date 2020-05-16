const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeItemsArray } = require('./items.fixtures')

describe('Items Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('gearboard_items').truncate())

    afterEach('cleanup', () => db('gearboard_items').truncate())

    describe('GET /api/items', () => {
        context('Given there are items in the database', () => {
            const testItems = makeItemsArray()
    
            beforeEach('insert items', () => {
                return db 
                    .into('gearboard_items')
                    .insert(testItems)
            })
    
            it('GET /items responds with 200 and all of the items', () => {
                return supertest(app)
                    .get('/api/items')
                    .expect(200, testItems)
            })
        })

        context('Given no items', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/items')
                    .expect(200, [])
            })
        })
    })

    describe('GET /api/items/:item_id', () => {
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
                    .get(`/api/items/${itemId}`)
                    .expect(200, expectedItem)
            })
        })

        context(`Given no items`, () => {
            it(`responds with 404`, () => {
                const itemId = 123456
                return supertest(app)
                    .get(`/api/items/${itemId}`)
                    .expect(404, { error: { message: `Item doesn't exist` } })
            })
        })

        context(`Given an XSS attack item`, () => {
            const maliciousItem = {
                id: '911',
                rating: '🎸',
                gear_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
                features: 'Naughty naughty very naughty <script>alert("xss");</script>',
                comments: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
            }

            beforeEach('insert malicious item', () => {
                return db
                    .into('gearboard_items')
                    .insert([ maliciousItem ])
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/items/${maliciousItem.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.gear_name).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                        expect(res.body.features).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                        expect(res.body.comments).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                    })
            })
        })
    })

    describe('POST /api/items', () => {
        it(`creates an item, responding with 201 and the new item`, function() {
            const newItem = {
                rating: '🎸',
                gear_name: 'Test post gear_name',
                features: 'Test post features',
                comments: 'Test post comments'
            }
            return supertest(app)
                .post('/api/items')
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
                .post('/api/items')
                .send(newItem)
                .expect(400, {
                    error: { message: `Missing '${field}' in request body` }
                })
           })
       })
        
    })

    describe(`DELETE /api/items/:item_id`, () => {
        context('Given there are items in the database', () => {
            const testItems = makeItemsArray()

            beforeEach('insert items', () => {
                return db
                    .into('gearboard_items')
                    .insert(testItems)
            })

            it('responds with 204 and removes the item', () => {
                const idToRemove = 2
                const expectedItems = testItems.filter(item => item.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/items/${idToRemove}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/items`)
                            .expect(expectedItems)    
                    )
            })
        })

        context(`Given no items`, () => {
            it(`responds with 404`, () => {
                const itemId = 123456
                return supertest(app)
                    .delete(`/api/items/${itemId}`)
                    .expect(404, { error: { message: `Item doesn't exist` } })
            })
        })
    })

    describe(`PATCH /api/items/:item_id`, () => {
        context('Given there are items in the database', () => {
            const testItems = makeItemsArray()

            beforeEach('insert items', () => {
                return db 
                    .into('gearboard_items')
                    .insert(testItems)
            })

            it('responds with 204 and updates the article', () => {
                const idToUpdate = 2
                const updateItem = {
                    rating: '🎸',
                    gear_name: 'Update gear_name test',
                    features: 'Update features test',
                    comments: 'Update comments test'
                }

                const expectedItem = {
                    ...testItems[idToUpdate - 1],
                    ...updateItem
                }

                return supertest(app)
                    .patch(`/api/items/${idToUpdate}`)
                    .send(updateItem)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/items/${idToUpdate}`)
                            .expect(expectedItem)    
                    )
            })

            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/items/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain 'rating', 'gear_name', 'features'`
                        }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateItem = {
                    gear_name: 'updated item gear_name'
                }
                
                const expectedItem = {
                    ...testItems[idToUpdate - 1],
                    ...updateItem
                }

                return supertest(app)
                    .patch(`/api/items/${idToUpdate}`)
                    .send({
                        ...updateItem, 
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res => 
                        supertest(app)
                        .get(`/api/items/${idToUpdate}`)
                        .expect(expectedItem)    
                    )
            })
        })


        context(`Given no items`, () => {
            it(`responds with 404`, () => {
                const itemId = 123456
                return supertest(app)
                    .patch(`/api/items/${itemId}`)
                    .expect(404, { error: { message: `Item doesn't exist` } })
            })
        })
    })
    
})