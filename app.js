//require dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require("./config");


//require routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRoutes');
var favoriteRouter = require('./routes/favoritesRouter')

//require mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//require models
const Dishes= require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');
const Favorites = require('./models/favorites')

const url = config.mongoUrl;
//connet mongoose
mongoose.connect(url);
let db =mongoose.connection;

//Add entry to database
const promotion1 = new Promotions({
  name: 'Justice Kachi',
  image: 'Justice.jpg',
  label: 'Exceptional for devrel',
  price: '290,000',
  description: 'Devrel lead position',
  featured:true
});

promotion1.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Promotion saved.');
  }
});

const promotion2 = new Promotions({
  name: 'Lance Kamsi',
  image: 'lance.jpg',
  label: 'Devops',
  price: '290,000',
  description: 'Devops lead position',
  featured:true
});

promotion2.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Promotion saved.');
  }
});


//leaders
const leader1 = new Leaders({
  name: 'Peter Obi',
  image: 'Obi.jpg',
  designation: 'President elect Nigeria',
  abbr: 'PGO',
  description: 'Nigeria President 2023',
  featured:true
});

leader1.save((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('leader saved.');
  }
});

//check connection
db.once('open',function(){
  console.log('connected to MongoDB');
})

//const url = 'mongodb://localhost:27017/conFusion';
//const connect = mongoose.connect(url, {useMongoClient: true});

//connect.then((db)=>{
  //console.log("connected to server");
//},(err)=> {console.log(err);});





//Express setup
var app = express();

app.all('*', (req,res,next) => {
  if(req.secure) {
    return next();
  }else {
    res.redirect(307,'https://'+ req.hostname + ':' + app.get('secPort') + req.url)
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876'));



//Authentication
{/*
app.use(session({
  name: "session-id",
  secret: '12345-67890-09876',
  saveUnitialized: false,
  resave: false,
  store: new FileStore()
}));

*/}

app.use(passport.initialize());
//app.use(passport.session());

//Users can access the homepage and signup page before authenticating
app.use('/', indexRouter);
app.use('/users', usersRouter);




{/*}
// function auth
function auth(req,res,next) {

  if(!req.user){
        var err = new Error('You are not authenticated');
        err.status =401;
        next(err);
  }else{
      next();
  }
}
//6:30
//9:29

app.use(auth); //before the client can access the below middlewares

*/}

// setup path
app.use(express.static(path.join(__dirname, 'public')));


// setup router 

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites', favoriteRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
