const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserWithEmail(db, email) {
        return db('gearboard_users')
            .where({ email })
            .first()
    },
    comparePasswords(password, hash) {
        if (password === hash) {
            return Promise.resolve(true)
        } else {
           return Promise.resolve(false)
        }
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject, 
            algorithm: 'HS256'
        })
    },
    verifyJwt(token) {
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    }
}

module.exports = AuthService