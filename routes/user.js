var express = require('express');
var router = express.Router();
var modelsModule = require('../models/models');
var User = require('../models/models').User;
var Tweet = require('../models/models').Tweet;

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

var isLiked = function(likesArr, userId){
    for(var i=0; i<likesArr.length; i++){
      if(likesArr[i]===userId.toString()){
        return true;
      }
    }
    return false;
}

//TODO: transfer the date conversion function here




module.exports = router;
