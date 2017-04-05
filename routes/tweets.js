var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;
var Tweet = require('../models/models').Tweet;

router.post('/new', function(req,res){
  var content = req.body.newTweet;
  var date = new Date();
  var likes = [];

  var newTweet = new Tweet({
    date: date,
    content: content,
    likes: likes,
    _creator: req.user._id
  });
  newTweet.save(function(err){
    if(err){
      throw err;
    }
  })
  console.log(req.user);
  res.redirect('/feed')
})

router.post('like', function(req,res){

});



module.exports = router;
