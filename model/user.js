require('dotenv').config()
const db = require('../config/dbmysql')
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const app = express()

// Register
app.post('/reg', bodyParser.json(), (req, res) => {
    let bd = req.body;
    let sql = `INSERT into users (userFName, userLName ,userEmail ,userPassword ,userRole)
    VALUES(?, ?, ?, ?, ?);`;
    db.query(sql, [bd.userFName, bd.userLName, bd.userEmail, bd.userPassword, bd.userRole],
        (err, results) => {
            if (err) {
                console.log(err)
            } else {
                res.send(`number rows affected ${results}`)
            }
        }
    )
});