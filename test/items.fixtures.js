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

module.exports = {
    makeItemsArray,
}