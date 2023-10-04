if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const session = require('express-session');
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cors = require('cors');
const flash = require('connect-flash');

 
const router = require('./router/router')
const authorRouter = require('./router/authors')
const bookRouter = require('./router/books')
const loginRouter = require('./router/login')
const { passport } = require('./services/passport')
const logoutRouter = require('./router/logout')

const User = require('./models/user')

//Set engine for Views
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

// Set parameters to use layouts
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))

var MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: process.env.DATABASE_URL,
  collection: 'mySessions'
})


app.use(session({
  secret: '1111',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));


store.on('error', function(error) {
  console.log('error',error);
});


app.use(flash());

// Make flash messages available in your routes
app.use((req, res, next) => {
  res.locals.successMessages = req.flash('successMessages');
  res.locals.errorMessages = req.flash('errorMessages');
  next();
});

//Static path for images + styles
app.use(express.static('public'))
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.urlencoded({ limit:"10mb", extended:false }))


//DB Connection
mongoose.connect(process.env.DATABASE_URL)
const db =mongoose.connection
db.on('error',error=>console.error(error))

const initializeAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      const newAdminUser = new User({
        username: 'admin',
        password: 'admin',
        role:'admin' // Change this to a secure password
      });
      await newAdminUser.save();
      const admin = await User.findOne({ role: 'admin' });
      console.log('Admin user created.',admin);
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

db.once('open',()=>{
  initializeAdminUser();
  console.log('Coneccted');
})


//add global vars for auth
app.use(async (req, res, next) => {
  res.locals.isUserLoggedIn = req.isAuthenticated()
  res.locals.isAdmin =  req.user && req.user.role == 'admin' ? true : false
  next();
});


//Router connect
app.use('/',router)
app.use('/authors',authorRouter)
app.use('/books',bookRouter);
app.use('/login',loginRouter)
app.use('/logout',logoutRouter)


//listen server
app.listen(process.env.PORT || 3000)