var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;
var Tweet = require('../models/models').Tweet;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var helperFunctions = require('../public/js/helperFunctions');
var dateConversion = helperFunctions.dateConversion;
var checkAuthenticated = helperFunctions.checkAuthenticated;
var checkNotAuthenticated = helperFunctions.checkNotAuthenticated;
var isLiked = helperFunctions.isLiked;

router.get('/', checkNotAuthenticated, function(req,res){
  res.render('index')
});

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, done) {
    modelsModule.getUserByEmail(email, function(err,user){
      if(err){
        throw err
      }
      if (!user) {
        return done(null, false, {message: 'Such email does not exist'});
      }
      modelsModule.comparePassword(password,user.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid Password'})
        }
      })
    })
  }
))

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  modelsModule.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
    passport.authenticate('local', {successRedirect: '/feed', failureRedirect: '/', failureFlash: true})
);

router.get('/signup', checkNotAuthenticated, function(req,res){
  res.render('signup')
})

router.post('/signup', function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var email=req.body.email;
  var firstName=req.body.firstName;
  var lastName=req.body.lastName;

  //Validation
  req.checkBody('username','Username is required').notEmpty();
  req.checkBody('username','Username cannot contain spaces').areNoSpaces();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Enter a valid email address KOREO').isEmail();
  req.checkBody('firstName','First Name is required').notEmpty();
  req.checkBody('lastName','Last Name is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('signup', {
      errors: errors
    })
  } else {
    var newUser = new User({
      username: username,
      password: password,
      email: email,
      firstName: firstName,
      lastName: lastName,
    })
    var cb = function(err){
      if (err){
        throw err;
      }
    }
    newUser.createSafeUser(cb);
    req.flash('success_msg','You have successfully registered and can now login');
    res.redirect('/')
  }

})

router.get('/feed', checkAuthenticated, function(req,res){
  Tweet.find()
  .populate('_creator')
  .exec(function(err, tweetsArr){
    dateConversion(tweetsArr);
    tweetsArr.map(function(element){
      if(isLiked(element.likes, req.user._id)){
        element.likeButton = "Unlike";
      } else {
        element.likeButton = "Like";
      }
    })
      tweetsArr.reverse();
      res.render('feed',{
        tweetsArr: tweetsArr
      });
  })
})

router.get('/messages', checkAuthenticated, function(req,res){
  res.render('messages',{
    user: req.user
  })
})

router.get('/logout', checkAuthenticated, function(req,res){
  req.logout();
  req.flash('success_msg','You have successfully logged out');
  res.redirect('/');
})

module.exports = router;
