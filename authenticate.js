var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');
const FacebookStrategy = require('passport-facebook').Strategy;



var config =require('./config');


//configure passport with the local strategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,{expiresIn:3600});
};

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    console.log("JWT payload", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user)=> {
        if(err){
            return done(err, false);
        }
        else if(user){
            return done(null, user)
        }
        else{
            return done(null,false);
        }
    })
})) 

exports.verifyUser = passport.authenticate('jwt',{session:false})


exports.verifyOrdinaryUser= (req,res,next,user)=>{
    passport.use(
        new JwtStrategy(opts,req,(jwt_payload, done) => {
            User.findOne({ _id: jwt_payload._id }, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    req.user = user; // Add this line to load the user object to the request object
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        })
    );
}


exports.verifyAdmin = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user.admin) {
            const err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
        req.user = user;
        next();
    })(req, res, next);
};

exports.confirmUser=(req,res,next)=>{
    const userId = req.user._id;
    const commentId = req.params.commentId;

    Dishes.findById(commentId)
        .then(dish => {
            if (dish.author._id.equals(userId)) {
                next(); // user is same as comment author, so allow operation to continue
            } else {
                const err = new Error('You are not authorized to change this comment!');
                err.status = 403;
                return next(err);
            }
        })
        .catch(err => next(err));

}

exports.facebookPassport = passport.use(new FacebookStrategy({clientID:config.facebook.clientId, clientSecret: config.facebook.clientSecret, callbackURL: "http://localhost:3000/auth/facebook/callback"},(accessToken,refreshToken,profile,done)=>{
    User.findOne({facebookId: profile.id}, (err,user)=>{
        if(err) {
            console.log(err)
            return done(err, false);
        }
        if(!err && user !== null){
            return done(null, user)
        }
        else {
            user= new User({username: profile.displayName});
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err,user)=>{
                if(err){
                    return done(err,false);
                }else{
                    return done(null,user);
                }
            })
        }
    })
}
))
