//TODO: CHANGE LIKE POST REQUEST USING AJAX AND JQUERY

var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;
var Tweet = require('../models/models').Tweet;

var helperFunctions = require('../public/js/helperFunctions');
var isLiked = helperFunctions.isLiked;

router.post('/new', function(req,res){
  var content = req.body.newtweet;
  var date = new Date();
  var likes = [];
  var newTweet = new Tweet({
    date: date,
    content: content,
    likes: likes,
    _creator: req.user._id
  });
  var tweetId;
  newTweet.save(function(err, data){
    if (err) throw err;
    tweetId = data._id
    User.findById(req.user._id, function(err, foundUser){
      console.log("in foundUser");
      console.log(tweetId);
      var tweetsArr = foundUser.tweets;
      tweetsArr.push(tweetId);
      foundUser.save(function(err, updatedUser){
        if (err) throw err;
        console.log('about to update a user')
        console.log(updatedUser);
        res.redirect('/feed')
      })
    })
  })
})

router.get('user/like/:tweetid', function(req,res){
  res.send(req.params)
})


module.exports = router;
