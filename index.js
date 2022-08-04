const express = require('express')
const app = express()
const db = require('./config/dbmysql')
const cors = require('cors')

// Set up port
const port = process.env.PORT || 5001

app.use(express.json())
app.use(cors())

// const router = require(express.router())
// app.use('/api')

app.listen(port , () => {console.log(`Sever is running ${port}`)})
