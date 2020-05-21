const bcrypt = require('bcryptjs')

const AuthService = {
    getUserWithEmail(db, email) {
        return db('gearboard_users')
            .where({ email })
            .first()
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    }
}

module.exports = AuthService