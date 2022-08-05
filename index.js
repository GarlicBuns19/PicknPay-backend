const express = require('express')
const app = express()
const db = require('./config/dbmysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path');
const bcrypt = require('bcrypt')
const {
    json
} = require('body-parser')
const router = express.Router();
// Set up port
const port = process.env.PORT || 5001

app.use(router, express.json(), express.urlencoded({
    extended: true
}))
app.use(cors())

// Home
app.get('/', (req, res, next) => {
    res.sendFile('./index.html', {
        root: __dirname
    })
})
// app.get('/prods', (req, res, next) => {
//     res.sendFile('./prod.html', {
//         root: __dirname
//     })
// })
// app.get('/signup', (req, res, next) => {
//     res.sendFile('./login.html', {
//         root: __dirname
//     })
// })

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

// app.post('/login',bodyParser.json(),async (req,res) =>{
//     try{
//         const {userEmail,userPassword} = req.body;
//         const sql = `SELECT userFName,userlName,userEmail,userPassword
//         FROM users
//         WHERE userEmail = ${userEmail};`;
//         db.query(sql,async (err,results)=> {
//             switch(true){
//                 case(await bcrypt.compare(userPassword,results[0].userPassword)):
//                 res.send('U loged in')
//                 break
//                 default:
//                     console.log('See u')
//             }
//         })
//     }catch{}
// })

app.post('/login', bodyParser.json(), (req, res) => {
    const strQry = `SELECT * FROM users WHERE ? ;`;
    let user = {
        userEmail: req.body.userEmail
    };
    db.query(strQry, user, async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            res.send('Email not found. Please register')
        } else {
            const isMatch = await bcrypt.compare(req.body.userPassword, results[0].userPassword);
            if (!isMatch) {
                res.send('Password is Incorrect')
            } else {
                const payload = {
                    user: {
                        userFName: results[0].userFName,
                        userLName: results[0].userLName,
                        userRole: results[0].userRole,
                        userEmail: results[0].userEmail,
                        userPassword: results[0].userPassword,
                    },
                };
                jwt.sign(payload, process.env.jwtsecret, {
                    expiresIn: "365d"
                }, (err, token) => {
                    if (err) throw err;
                    res.send(token)
                });
            }
        }
    })
})

app.get("/users/verify", (req, res) => {
    const token = req.header("x-auth-token");
    jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).send("Unauthorized Access!");
      } else {
        res.status(200).send(decodedToken);
      }
    });
  });

app.get('/prod', bodyParser.json(), (req, res) => {
    let bd = req.body
    let sql = `SELECT * FROM products`
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                results: results
            })
        }
    })
})
// const router = require(express.router())
// app.use('/api')

app.listen(port, () => {
    console.log(`Sever is running http://localhost:${port}`)
})