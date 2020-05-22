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
            full_name: 'Demo',
            email: 'dodo@gmail.com',
            password: 'password'
        },
        {  
            full_name: 'Test',
            email: 'gearboard@123.com',
            password: 'password'
        },
        {
            full_name: 'Test',
            email: 'fearboard@111.com',
            password: 'password'
        }
    ]
}


function makeItemsFixtures() {
    const testUsers = makeUsersArray()
    const testItems = makeItemsArray()

    return { testUsers, testItems }
}

/*
function makeAuthHeader(email, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ email: email.id}, secret, {
        subject: email.email, 
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}
*/

function makeAuthHeader(user) {
    const token = Buffer.from(`${user.email}:${user.password}`).toString('base64')
    return `Basic ${token}`
}

module.exports = {
    makeItemsArray,
    makeUsersArray,
    makeAuthHeader, 
    makeItemsFixtures
}