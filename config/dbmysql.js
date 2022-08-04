const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbName,
    multipleStatements: true
})

connection.connect((err) => {
    if(err){
        console.log(err)
    }else{
        console.log('Mysql is connected')
    }
})

module.exports = connection