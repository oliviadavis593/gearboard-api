const jwt = require('jsonwebtoken')

function makeItemsArray() {
    return [
        {
            id: 1,
            rating: '🎸🎸',
            gear_name: 'Test gear name',
            features: 'Test feature',
            comments: 'Test comments'
        },
        {
            id: 2, 
            rating: '🎸🎸🎸',
            gear_name: 'Test gear name #2',
            features: 'Test features #2',
            comments: 'Test comments #2'
        },
        {
            id: 3, 
            rating: '🎸',
            gear_name: 'Test gear name #3',
            features: 'Test features #3',
            comments: 'Test comments #3'
        },
    ];
}

function makeUsersArray() {
    return [
        {
            email: 'dodo@gmail.com',
            password: 'password'
        },
        {
            email: 'gearboard@123.com',
            password: 'password'
        },
        {
            email: 'fearboard@111.com',
            password: 'password'
        }
    ]
}

function makeItemsFixtures() {
    const testUsers = makeUsersArray()

    return { testUsers }
}

function makeAuthHeader(email, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ email: email.id}, secret, {
        subject: email.email, 
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}



module.exports = {
    makeItemsArray,
    makeUsersArray,
    makeAuthHeader, 
    makeItemsFixtures
}