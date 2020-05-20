const knex = require('knex')
const app = require('../src/app')
const { makeLoginArray } = require('./items.fixtures')

describe.only('Auth Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('gearboard_users').truncate())

    afterEach('cleanup', () => db('gearboard_users').truncate())

    describe(`POST /api/login`, () => {
        const testUser = makeLoginArray()

        beforeEach('insert users', () => {
            return db 
                .into('gearboard_users')
                .insert(testUser)
        })

        const requiredFields = ['email', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                email: testUser.email, 
                password: testUser.password
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    })
            })
        })
    })
})