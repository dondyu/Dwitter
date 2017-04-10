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

var isFollowed = function(followersArr, followingsArr, followerId, followingId){
  for (var i=0; i<followersArr.length; i++){
    for (var z=0; z<followingsArr.length; z++){
      if (followersArr[i]===followerId && followingsArr[z]===followingId){
          return true
      }
    }
  }
  return false;
}


var dateConversion = function(tweetsArr){
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  tweetsArr.map(function(element){
    var date = element.date;
    var minutes = date.getMinutes();
    var hours = date.getHours();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var formattedDate = ' ' + hours + ':' + minutes + ' on '+ monthNames[month] + ' ' + day + ', ' + year;
    element.formattedDate = formattedDate;
    if(isLiked(element.likes, element._creator._id)){
      element.likeButton = "Unlike";
    } else {
      element.likeButton = "Like";
    }
    return element;
  })
}

module.exports = {
  checkAuthenticated: checkAuthenticated,
  checkNotAuthenticated: checkNotAuthenticated,
  isLiked: isLiked,
  isFollowed: isFollowed,
  dateConversion: dateConversion
}
