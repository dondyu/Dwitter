var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;
var Tweet = require('../models/models').Tweet;

var helperFunctions = require('../public/js/helperFunctions');
var dateConversion = helperFunctions.dateConversion;
var checkAuthenticated = helperFunctions.checkAuthenticated;
var checkNotAuthenticated = helperFunctions.checkNotAuthenticated;
var isLiked = helperFunctions.isLiked;
var isFollowed = helperFunctions.isFollowed;


router.get('/:userId', checkAuthenticated, function(req,res){
  User.findById(req.params.userId)
  .populate({path: 'tweets',
             model: 'Tweet',
             populate: {
               path: '_creator',
               model: 'User'
             }})
  .exec(function(err, foundUser){

    var tweetsArr = foundUser.tweets
    dateConversion(tweetsArr);
    tweetsArr.map(function(element){
      if(isLiked(element.likes, req.user._id)){
        element.likeButton = "Unlike";
      } else {
        element.likeButton = "Like";
      }
    })
    tweetsArr.reverse();
    //TODO: CHANGE THE SCRIPT THING

    User.findById(req.user._id, function(err, currentUser){
      var followersArr=foundUser.followers;
      var followingsArr=currentUser.following;
      var followerId = req.user._id.toString();
      var userToFollowId = req.params.userId;
        if (followerId === userToFollowId){
          var script = "<script>$('#followButton').hide()</script>"
        } else if (isFollowed(followersArr, followingsArr, followerId, userToFollowId)){
          console.log('yes')
          foundUser.followButton = "Unfollow";
        } else {
          console.log('no')
          foundUser.followButton = "Follow"
        }
        res.render('profile', {
          User: foundUser,
          script: script
        })
    })


  })
})

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
      res.redirect(req.get('referer'));                             //TODO: CHANGE REDIRECT THING;
    })
  })
});

router.post('/follow/:userId', function(req,res){
  var followerId = req.user._id.toString();
  var userToFollowId = req.params.userId;
  User.findById(followerId, function(err, follower){
    if (err) throw err;
    User.findById(userToFollowId, function(err, userToFollow){
      if(err) throw err;
      var followersArr=userToFollow.followers;
      var followingsArr=follower.following;
      console.log(followersArr, followingsArr, followerId, userToFollowId)
      if (isFollowed(followersArr, followingsArr, followerId, userToFollowId)){
        followingsArr.splice(followingsArr.indexOf(userToFollowId),1)
        followersArr.splice(followersArr.indexOf(followerId), 1)
      } else {
        followingsArr.push(userToFollowId);
        followersArr.push(followerId);
      }
      follower.save(function(err, updatedFollower){
        if(err) throw err;
        console.log(updatedFollower);
      })
      userToFollow.save(function(err, updatedUserToFollow){
        if(err) throw err;
        console.log(updatedUserToFollow);
        res.redirect(req.get('referer'));       //TODO:CHANGE REDIRECT THING;
      })
    })
  })
})



module.exports = router;
