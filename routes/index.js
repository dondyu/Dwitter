var express = require('express');
var router = express.Router();
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

router.post('/login', function(req,res){
  console.log('login pressed')
  console.log(req.body.email);
  //PASSPORT AUTHENTICATION
  // passport.authenticate('local', { failureRedirect: '/login' }),
  //   function(req, res) {
  //     res.redirect('/feed');
  //   }

})

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
    res.redirect('/feed')
  }
  // User.create({
  //   username: req.body.username,
  //   password: req.body.password,
  //   firstName: req.body.firstName,
  //   lastName: req.body.lastName
  // }, function(err){
  //   if (err){
  //     console.log(err)
  //   }
  // })

})


module.exports = router;
