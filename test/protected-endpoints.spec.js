const knex = require('knex')
const app = require('../src/app')
const helpers = require('./items.fixtures')

describe.skip('Protected Endpoints', () => {
    let db 

    const { testUsers } = helpers.makeItemsFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('gearboard_users').truncate())

    afterEach('cleanup', () => db('gearboard_users').truncate())

    describe('GET /api/items', () => {
        beforeEach('insert user', () => {
            return db 
            .into('gearboard_users')
            .insert(testUser)
          })

          const protectedEndpoints = [
              {
                  name: 'GET /api/items', 
                  path: '/api/items',
                  method: supertest(app).get
              }
          ]

          protectedEndpoints.forEach(endpoint => {
              describe(endpoint.name, () => {
                it(`responds 401 'Missing basic token' when no basic token`, () => {
                    return endpoint.method(endpoint.path)
                        .expect(401, { error: `Missing basic token` })
                })
              })
          })
    })

})