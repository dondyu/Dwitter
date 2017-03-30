var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var User = require('./models/models').User;
var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');

//SETTING THE VIEW ENGINE
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
//SETTING THE BODYPARSER MIDDLEWARE
app.use(bodyParser());
app.use(cookieParser());

//EXPRESS SESSION
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

//PASSPORT INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS VALIDATOR
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  // errorFormatter: function(param, msg, value) {
  //     var namespace = param.split('.')
  //     , root    = namespace.shift()
  //     , formParam = root;
  //
  //   while(namespace.length) {
  //     formParam += '[' + namespace.shift() + ']';
  //   }
  //   return {
  //     param : formParam,
  //     msg   : msg,
  //     value : value
  //   };
  // },
  customValidators: {
    areNoSpaces: function(value){
      console.log(value);
      var newVal = value.split('');
      console.log(newVal);
        for (var i=0; i<=newVal.length; i++){
          if(newVal[i]===' '){
            return false;
          }
        }
      return true;
    }
 }
}));

//CONNECT FLASH
app.use(flash());

//GLOBAL VARS
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // console.log(req.flash('haha'));
  next();
})



//ROUTES
app.use('/', routes);
app.use('/users', users);

//PASSPORT STRATEGY
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (user.password!==password) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));
//
// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });
//
// passport.deserializeUser(function(id, cb) {
//   db.users.findById(id, function (err, user) {
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });







app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function(){
  console.log('Server started on port '+ app.get('port'))
})
