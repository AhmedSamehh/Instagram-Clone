const express = require('express')
const mongoose = require('mongoose')
const { MONGOURL } = require('./config/keys')
const app = express()
const PORT = process.env.PORT || 5000
require('./models/user')
require('./models/post')
const auth = require('./routes/auth')
const post = require('./routes/post')
const user = require('./routes/user')


app.use(express.json())
app.use(auth)
app.use(user)
app.use(post)


mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=>{
    console.log('Connected to Mongo')
})
mongoose.connection.on('error', ()=>{
    console.log('Error Connecting to Mongo')
})

if(process.env.NODE_ENV=='production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname,'client','build', 'index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log('Server is running on Port '+ PORT) 
})