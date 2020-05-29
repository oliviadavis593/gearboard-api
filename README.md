# GearBoard
- [GearBoard](https://gearboard-app.now.sh/) is a full-stack React application designed to help music lovers keep track of their gear! It provides a responsive, intuitive experience for users to add gear and track all of their instruments. 

# API Overiew

```
/api
.
├── /auth
│   └── POST
│       ├── /login
├── /users
│   └── GET
│   └── POST
├── /items
│   └── GET
│   └── PUT
│       ├── /:item_id
│   └── DELETE
│       ├── /:item_id   
```

# POST `/api/auth/login`
```
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