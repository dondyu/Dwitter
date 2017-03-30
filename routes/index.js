var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// var app = express();



router.get('/', function(req,res){
  res.render('index')
});


router.get('/feed', function(req,res){
  // res.sendFile(path.join(__dirname, 'public/feed.html'))
  // res.sendFile('feed.html')
  // res.render('feed.html')
  res.render('feed');
})

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));


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


router.get('/signup', function(req,res){
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

    req.flash('success_msg','You have successfully registered and now can login');

    res.redirect('/')
  }

})

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success_msg','You have successfully logged out');
  res.redirect('/');
})

module.exports = router;
