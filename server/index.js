const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoute = require('./Routes/userRoutes')
const chatRoute = require('./Routes/chatRoutes')
const messageRoute = require('./Routes/messageRoutes')

const app = express() 
require('dotenv').config({path : './server/.env'})   // problem to configure dotenv with nodemon, it's not loading dotenv when running with nodemon

// Getting data from dotenv file
const port = process.env.PORT || 3000
const uri = process.env.ATLAS_URI

app.use(express.json())
app.use(cors())
app.use('/api/users', userRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)

// CRUD operations in nodejs
app.get("/", (req, res) => {
    res.send("Welcome to our Chat App")
})


// listening on some port
app.listen(port, (req, res) => {
    console.log(`Server running on port : ${port}`)
})

// Connection with DB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDb Connected Sucessfully"))
.catch((err) => console.log("MonogDb Connection Failed", err.message))