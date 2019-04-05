const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev');

const session = require('express-session');
const passport = require('passport');

// const MongoDBStore = require('connect-mongodb-session')(session);

/*
 * Only For Session Authentication
 * */
/*
 * MongoDB sessions setup
 * */
// const store = new MongoDBStore({
//   uri: config.DB_URI,
//   collection: 'authSessions'
// });

// store.on('error', err => console.log(err));

/*
 * Models
 * */
require('./models/meetups');
require('./models/users');
require('./models/threads');
require('./models/posts');
require('./models/categories');

require('./services/passport');

/*
 * Routes
 * */
const meetupsRoutes = require('./routes/meetups');
const usersRoutes = require('./routes/users');
const threadsRoutes = require('./routes/threads');
const postsRoutes = require('./routes/posts');
const categoriesRoutes = require('./routes/categories');
const apiRoutes = require('./routes/api');

mongoose
  .connect(config.DB_URI, { useNewUrlParser: true })
  .then(() => console.log('DB Connected!'))
  .catch((err) => console.log(err));

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { pingTimeout: 60000 });

require('./socket')(io);

app.use(bodyParser.json());

/*
 * Only For Session Authentication
 * */
/*
 * Session middlewares setup
 * */
// app.use(
//   session({
//     secret: config.SESSION_SECRET,
//     cookie: { maxAge: 3600000 },
//     resave: false,
//     saveUninitialized: false,
//     store
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/api/v1/', apiRoutes);
app.use('/api/v1/meetups', meetupsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/posts', postsRoutes);
app.use('/api/v1/threads', threadsRoutes);
app.use('/api/v1/categories', categoriesRoutes);

const PORT = process.env.PORT || 3001;

server.listen(PORT, function() {
  console.log('App is running on port: ' + PORT);
});
