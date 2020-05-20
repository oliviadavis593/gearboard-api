
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

function makeLoginArray() {
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



module.exports = {
    makeItemsArray,
    makeLoginArray
}