if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

 
const router = require('./router/router')
const authorRouter = require('./router/authors')
const bookRouter = require('./router/books')

//Set engine for Views
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

// Set parameters to use layouts
app.set('layout','layouts/layout')
app.use(expressLayouts)

//Static path for images + styles
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ limit:"10mb", extended:false }))


//DB Connection
mongoose.connect(process.env.DATABASE_URL)
const db =mongoose.connection
db.on('error',error=>console.error(error))
db.once('open',()=>{console.log('Coneccted');})

//Router connect
app.use('/',router)
app.use('/authors',authorRouter)
app.use('/books',bookRouter)


//listen server
app.listen(process.env.PORT || 3000)