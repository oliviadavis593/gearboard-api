# GearBoard 🎸
- [GearBoard](https://gearboard-app.now.sh/) is a full-stack React application designed to help music lovers keep track of their gear! It provides a responsive, intuitive experience for users to add gear and track all of their instruments. 

# API Overiew 👩‍💻

```
/api
.
├── /auth
│   └── POST
│       ├── /login
├── /users
│   └── POST
├── /items
│   └── GET
│   └── PUT
│       ├── /:item_id
│   └── DELETE
│       ├── /:item_id   
```

### POST `/api/login`
```javascript
//req.body
{
    username: String, 
    password: String, 
}

//res.body
{
    authToken: String
}
```

### POST `/api/users`
```javascript
//req.body
{
    full_name: String, 
    email: String, 
    password: String 
}

//res.body
{
    full_name: String, 
    email: String, 
    password: String
}
```

### GET `/api/items`
```javascript
//req.body
[
    {
        rating: '🎸',
        gear_name: String, 
        features: String, 
        comments: String
    }
]
```

### PUT `/api/items/:item_id`
```javascript
//req.body
{
    rating: '🎸',
    gear_name: [String],
    features: [String],
    comments: [String]
}

//res.body
{
    [
        id: item_id, 
        rating: '🎸',
        gear_name: [String]
        features: [String], 
        comments: [String]
    ]
}
```

# Tech Used 🖥
- [Node](https://nodejs.org/en/) - Run-time environment
- [Express](https://expressjs.com/) - Web application framework
- [PostgreSQL](https://www.postgresql.org/) - Relational Database Management System
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password Hashing
- [JWT](https://jwt.io/) - Authentication 
- [Mocha](https://mochajs.org/) - Testing
- [Chai](https://www.chaijs.com/) - Testing