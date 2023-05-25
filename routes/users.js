var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');
//const { authenticate } = require('passport');

const cors = require('./cors');

var authenticate = require ('../authenticate');
const { route } = require('.');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*',cors.corsWithOptions,(req,res)=> {res.sendStatus(200);})

router.route('/')
.get(cors.corsWithOptions,authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req,res,next)=>{
   User.find({})
   .then((users)=> {
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
   },(err)=>next(err))
   .catch((err)=> next(err));
})



//Sign up
router.post('/signup',cors.corsWithOptions,(req,res,next)=> {
  User.register(new User({username: req.body.username}),
  req.body.password, (err,user)=> {
  if(err){
    res.statusCode =500,
    res.setHeader('Content-Type', 'application/json');
    res.json({err:err});
  }
  else{
    if(req.body.firstname)
      user.firstname = req.body.firstname;

      if(req.body.lastname)
      user.lastname = req.body.lastname;

      user.save((err,user)=>{
        if(err){
          res.statusCode =500,
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req,res, ()=>{
          passport.authenticate('local')(req,res, ()=> {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful', user:user })
          });
        });
      })
      
    }
  })
})

//21:31




//login
router.post('/login',cors.corsWithOptions,(req, res,next)=>{

    passport.authenticate('local', (err,user,info)=> {

      if(err)
        return next(err);

        if(!user) {
          res.statusCode =401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false,status: 'Login Unuccessful',err: info})
        }
        
        req.logIn(user, (err)=> {
          if (err) {
            res.statusCode =401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Login unsuccessful', err:'could not log user in'})
          }
          
          var token = authenticate.getToken({_id: req.user._id});
          res.statusCode =200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true,token:token, status: 'Login Successful'})
        });
      })(req,res,next);
})


router.get('/logout',cors.corsWithOptions, (req,res)=>{
  
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


router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',failureRedirect: '/login' }));


router.get('/auth/facebook', passport.authenticate('facebook'),(req,res)=>{
  if(req.user){
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,token:token, status: 'Login Successful'})
  }
})


//check if the json web token is still valid or expired
router.get('/checkJWTToken', cors.corsWithOptions,(req,res)=>{
  passport.authenticate('jwt', {session:false},(err,user,info)=>{
    if(err){
      return next(err);
    }

    if(!user){
      res.statusCode=401;
      res.setHeader('Content-Type','application/json')
      return res.json({status: 'JWT invalid!', success:false,err:info})
    }
    else{
      res.statusCode =200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true,user:user, status: 'JWT valid!'})
    }
  })(req,res);
})

module.exports = router;

