//imports
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/routing')
require('./config/db')

//server
const eventServer = express()
//cors
eventServer.use(cors())
//json server
eventServer.use(express.json())
//use router
eventServer.use(router)
//port
const PORT = 3000
//server listen
eventServer.listen(PORT,()=>{
    console.log("Event Server Started... and waiting for client request"); 
})
//get request resolve
eventServer.get('/',(req,res)=>{
    res.status(200).send('<h1>Event Server Started... and waiting for client request</h1>')
})