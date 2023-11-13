
const { graphqlHTTP } = require('express-graphql');

const session = require('express-session');
const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const cors = require('cors');
const flash = require('connect-flash');
const { PubSub } = require('graphql-subscriptions');
const { ApolloServer } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const { execute, subscribe } = require('graphql');
const router = require('./router/router')
const authorRouter = require('./router/authors')
const bookRouter = require('./router/books')
const loginRouter = require('./router/login')
const emailRouter = require('./router/email')
const { passport } = require('./services/passport')
const logoutRouter = require('./router/logout')

const User = require('./models/user')
const pubsub = new PubSub();


const app = express()


if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}


const types = require('./graphql/graphql-types');
const resolvers = require('./graphql/resolvers');
const schema = require('./graphql/schema'); 

const corsOptions = {
  origin: [
    'http://localhost:3001',
    'https://iom-creators.com',
    'https://own-landing-git-develop-ioms-projects.vercel.app',
    'https://own-landing.vercel.app',
    'https://own-landing-git-main-ioms-projects.vercel.app',
  ],
  methods: 'POST', // Allow only the POST method
  credentials: false, // Allow cookies to be sent in cross-origin requests
};

app.use(cors(corsOptions));

const apolloServer = new ApolloServer({
  typeDefs: types,
  resolvers,
  context: ({ req, res }) => ({ req, res, pubsub }),
});



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


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true, // Optional, for a GraphiQL interface
}));


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



app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());


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
app.use('/email',emailRouter)



async function startApolloServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
}


startApolloServer().then(() => {
  // Middleware has been applied, now start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  // Create a SubscriptionServer for WebSocket subscriptions
  SubscriptionServer.create(
    { execute, subscribe, schema: apolloServer.schema },
    { server: app, path: apolloServer.graphqlPath }
  );
});

require('./websocket-server'); 