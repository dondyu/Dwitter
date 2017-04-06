var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;
var Tweet = require('../models/models').Tweet;

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
        console.log(updatedUser);
        res.redirect('/feed')
      })
    })
  })
})

router.get('/like/:tweetid', function(req,res){
  res.send(req.params)
})

var isLiked = function(likesArr, userId){
    for(var i=0; i<likesArr.length; i++){
      if(likesArr[i]===userId.toString()){
        return true;
      }
    }
    return false;
}

router.post('/like/:tweetid', function(req,res){
  Tweet.findById(req.params.tweetid, function(err, foundTweet){
    var likesArr = foundTweet.likes;
    var userId = req.user._id
    if (isLiked(likesArr, userId)){
      likesArr.splice(likesArr.indexOf(userId), 1)
      } else {
      likesArr.push(userId)
    }
    foundTweet.save(function(err, updatedTweet){
      if (err) throw err;
      res.redirect('/feed')
    })
  })
});



module.exports = router;
