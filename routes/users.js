var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
//const { authenticate } = require('passport');

var authenticate = require ('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//Sign up
router.post('/signup', (req,res,next)=> {
  User.register(new User({username: req.body.username}),
  req.body.password, (err,user)=> {
  if(err){
    res.statusCode =500,
    res.setHeader('Content-Type', 'application/json');
    res.json({err:err});
  }
  else{
      passport.authenticate('local')(req,res, ()=>{
        passport.authenticate('local')(req,res, ()=> {
          res.statusCode =200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful', user:user })
        })
      })
    }
  })
})

//21:31


//login
router.post('/login', passport.authenticate('local'),(req, res,user)=>{
          
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode =200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,token:token, status: 'Login Successful'})

})


router.get('/logout', (req,res)=>{
  
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id'); //session-id:name of cookie
    res.redirect('/')
  }
  else {
    var err = new Error('You are not logged in');
    err.status = 403
    next(err);
  }
});

module.exports = router;

