const AuthService = require('../auth/auth-service')

//processes requests that contain basic token 
function requireAuth(res, req, next) {
    console.log('requireAuth')
    console.log(req.get('Authorization'))
    next()
}

module.exports = {
    requireAuth,
}

/*
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
            if (!email || user.password !== tokenPassword) {
                return res.status(401).json({ error: 'Unauthorized request' })
            }
            next()
        })
        .catch(next)
*/