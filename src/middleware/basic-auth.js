const AuthService = require('../auth/auth-service')

//processes requests that contain basic token 
function requireAuth(res, req, next) {
    const authToken = req.get('Authorization') || ''
    
    let basicToken 
    if (!authToken.toLowerCase().startsWith('basic ')) {
        return res.status(401).json({ error: 'Missing basic token' })
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length)
    }

    const [tokenEmail, tokenPassword] = AuthService.parseBasicToken(basicToken)

    if (!tokenEmail || !tokenPassword) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    AuthService.getUserWithEmail(
        req.app.get('db'),
        tokenEmail
    )
        .then(email => {
            if (!email) {
                return res.status(401).json({ error: 'Unauthorized request' })
            }

            return AuthService.comparePasswords(tokenPassword, user.password)
                .then(passwordsMatch => {
                    if (!passwordsMatch) {
                        return res.status(401).json({ error: 'Unauthorized request' })
                    }

                    req.email = email
                    next()
                })
                .catch(next)
        })
}

module.exports = {
    requireAuth,
}