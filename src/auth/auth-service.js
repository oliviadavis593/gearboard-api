const AuthService = {
    getUserWithEmail(db, email) {
        return db('gearboard_users')
            .where({ email })
            .first()
    },
    parseBasicToken(token) {
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    }
}

module.exports = AuthService