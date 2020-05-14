require('dotenv').config();

//reads db connection info from .env file 
module.exports = {
    "migrationsDirectory": "migrations",
    "driver": "pg",
    "connectionString": process.env.DB_URL
}

