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
var tweets = require('./routes/tweets');
var profile = require('./routes/profile');

//SETTING UP THE SERVER AND INITIALIZING SOCKET.IO
app.set('port', (process.env.PORT || 3000))
var server = app.listen(app.get('port'), function(){
  console.log('Server started on port '+ app.get('port'))
})
var io = require('socket.io').listen(server)
var connections = [];

//SOCKET.IO TODO: Create a user-to-user chat
io.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length)
  // socket.emit('send', {hello: 'world'})
  // socket.on ('receive', function(data){
  //   console.log(data)
  // })

  //Send message
  socket.on('send message', function(data){
    console.log(data)
    io.sockets.emit('new message', data)
  })

  //Disconnect
  socket.on('disconnect', function(data){
    connections.splice(connections.indexOf(socket), 1);
    console.log('disconnected', connections.length);
  })
})

//SETTING THE VIEW ENGINE
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '/public')));

//SETTING THE BODYPARSER MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
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
app.use(expressValidator({
  customValidators: {
    areNoSpaces: function(value){
      console.log('in custom validator');
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
  res.locals.user = req.user || null
  next();
})

//ROUTES
app.use('/', routes);
app.use('/tweets', tweets);
app.use('/profile', profile);
