const express = require('express')
const app = express()
const db = require('./config/dbmysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { json } = require('body-parser')
const router = express.Router();
// Set up port
const port = process.env.PORT || 5001

app.use(router, express.json(), express.urlencoded({
    extended: true
}))
app.use(cors())

// Home
app.get('/',(req,res) => {
    res.sendFile('./index.html', {root : __dirname})
})

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
                res.send(`number rows affected ${results.affectedRows}`)
            }
        }
    )
});
// const router = require(express.router())
// app.use('/api')

app.listen(port , () => {console.log(`Sever is running ${port}`)})
