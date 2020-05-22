const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const bodyParser = express.json()

authRouter
    .post('/login', bodyParser, (req, res, next) => {
       const { email, password } = req.body
       const loginUser = { email, password }
       console.log("loginUser", loginUser)
       for (const [key, value] of Object.entries(loginUser))
            if(value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        AuthService.getUserWithEmail(
            req.app.get('db'),
            loginUser.email
        )
            .then(dbUser => {
                console.log("dbUser", dbUser)
                if (!dbUser)
                    return res.status(400).json({
                        error: 'Incorrect email or password'
                    })
                    return AuthService.comparePasswords(loginUser.password, dbUser.password)
                        .then(compareMatch => {
                            console.log("compareMatch", compareMatch)
                            if (!compareMatch)
                                return res.status(400).json({
                                    error: 'Incorrect email or password'
                                })
                                res.send('ok')
                        })
            })
            .catch(next)
    })

module.exports = authRouter 