var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;
var Tweet = require('../models/models').Tweet;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var checkAuthenticated = function (req,res,next){
  if(req.isAuthenticated()){
    next();
  } else {
    req.flash('error_msg', 'You are not logged in')
    res.redirect('/')
  }
}

var checkNotAuthenticated = function(req,res,next){
  if (!req.isAuthenticated()){
    next();
  } else {
    res.redirect('/feed')
  }
}
router.get('/', checkNotAuthenticated, function(req,res){
  res.render('index')
});

var isLiked = function(likesArr, userId){
    for(var i=0; i<likesArr.length; i++){
      if(likesArr[i]===userId.toString()){
        return true;
      }
    }
    return false;
}

//TODO: Transfer the date conversion function

router.get('/feed', checkAuthenticated, function(req,res){
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  Tweet.find()
  .populate('_creator')
  .exec(function(err, tweetsArr){
    tweetsArr.map(function(element){
        //formatting the date
        var date = element.date;
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var formattedDate = monthNames[month] + ' ' + day + ', ' + year;
        element.formattedDate = formattedDate;
        if(isLiked(element.likes, element._creator._id)){
          element.likeButton = "Unlike";
        } else {
          element.likeButton = "Like";
        }
        return element;
      })
      tweetsArr.reverse();
      res.render('feed',{
        tweetsArr: tweetsArr
      });
  })
})

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
  console.log('signup pressed')
  console.log(req.body.username)
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
    console.log('NO GOOD (errors)')
    console.log(errors);
    res.render('signup', {
      errors: errors
    })
  } else {
    console.log('ya gud with validation errors')
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

router.get('/:userId', checkAuthenticated, function(req,res){
  User.findById(req.params.userId)
  .populate({path: 'tweets',
             model: 'Tweet',
             populate: {
               path: '_creator',
               model: 'User'
             }})
  .exec(function(err, foundUser){
    console.log(foundUser);
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var tweetsArr = foundUser.tweets
    tweetsArr.map(function(element){
        //formatting the date
        var date = element.date;
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var formattedDate = monthNames[month] + ' ' + day + ', ' + year;
        element.formattedDate = formattedDate;
        if(isLiked(element.likes, element._creator._id)){
          element.likeButton = "Unlike";
        } else {
          element.likeButton = "Like";
        }
        return element;
      })
    res.render('profile', {
      User: foundUser
    })
  })
})

router.get('/logout', checkAuthenticated, function(req,res){
  req.logout();
  req.flash('success_msg','You have successfully logged out');
  res.redirect('/');
})

module.exports = router;
