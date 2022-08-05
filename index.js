const express = require('express')
const app = express()
const db = require('./config/dbmysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path');
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
app.get('/',(req,res, next) => {
    res.sendFile('./index.html', {root : __dirname})
})
app.get('/prods',(req,res, next) => {
    res.sendFile('./prod.html', {root : __dirname})
})

// Register
app.post('/reg', bodyParser.json(), async (req, res) => {
    let bd = req.body;
    bd.userPassword = await bcrypt.hash(bd.userPassword, 10)
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
        res.redirect('/')
});

app.post('/login',bodyParser.json(),(req,res) =>{
    try{
        const {userEmail,userPassword} = req.body;
        const sql = `SELECT userFName,userlName,userEmail,userPassword
        FROM users
        WHERE userEmail = ${userEmail};`;
        db.query(sql,async (err,results)=> {
            if(err){
                console.log(err)
            }else{

            }
        })
    }catch{}
})

app.get('/prod',bodyParser.json(),(req,res) => {
    let bd= req.body
    let sql = `SELECT * FROM products`
    db.query(sql,(err,results) => {
        if(err){
            console.log(err)
        }else{
            res.json({results : results})
        }
    })
})
// const router = require(express.router())
// app.use('/api')

app.listen(port , () => {console.log(`Sever is running http://localhost:${port}`)})
