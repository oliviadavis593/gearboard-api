const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./items.fixtures')

describe('Users Endpoints', function() {
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

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () => {
                return db 
                    .into('gearboard_users')
                    .insert(testUsers)
            })

            const requiredFields = ['full_name', 'email', 'password']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    full_name: 'test full_name',
                    email: 'test@email.com',
                    password: 'password'
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })

                it(`responds with 400 'Password must be longer than 8 characters' when empty password`, () => {
                    const userShortPassword = {
                        full_name: 'test full_name',
                        password: '1234567', 
                        email: 'test@email.com'
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userShortPassword)
                        .expect(400, { error: `Password must be longer than 8 characters` })
                })

                it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                    const userLongPassword = {
                        email: 'test@email.com',
                        password: '*'.repeat(73),
                        full_name: 'test full_name'
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userLongPassword)
                        .expect(400, { error: `Password must be less than 72 characters` })
                })

                it(`responds 400 error when password starts with spaces`, () => {
                    const userPasswordStartsSpaces = {
                        full_name: 'test full_name',
                        password: ' 1Aa!2Bb@',
                        email: 'test@email.com'
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordStartsSpaces)
                        .expect(400, { error: `Password must not start with or end with empty spaces` })
                })

                it(`responds 400 error when password ends with spaces`, () => {
                    const userPasswordEndsSpaces = {
                        full_name: 'test full_name',
                        password: '1Aa!2Bb@ ',
                        email: 'test@email.com'
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordEndsSpaces)
                        .expect(400, { error: `Password must not start with or end with empty spaces` })
                })

                it(`responds 400 error when password isn't complex enough`, () => {
                    const userPasswordNotComplex = {
                        full_name: 'test full_name',
                        password: '11AAaabb',
                        email: 'test@email.com'
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(userPasswordNotComplex)
                        .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
                })

                it(`responds with 400 'email already in use' when email isn't unique`, () => {
                    const duplicateEmail = {
                        email: testUser.email, 
                        password: '11AAaa!!',
                        full_name: 'test full_name'
                    }
                    return supertest(app)
                        .post('/api/users')
                        .send(duplicateEmail)
                        .expect(400, { error: `Email already in use` })
                })
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    full_name: 'test full_name',
                    password: '11AAaa!!',
                    email: 'test@email.com',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.full_name).to.eql(newUser.full_name)
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res =>
                        db
                            .from('gearboard_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.full_name).to.eql(newUser.full_name)
                                expect(row.email).to.eql(newUser.email)

                                return bcrypt.compare(newUser.password, row.password)
                            })  
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })  
                    )
            })
        })
    })
})