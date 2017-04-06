$(document).ready(function(){
  $('.likeButton').click(function(){
    var numberOfLikes =  $('#numberOfLikes').text(); //TODO: figure out how to refer to this ID
    var numberOfLikes = parseInt(numberOfLikes)
    if($(this).val()==='Like'){
      $(this).val('Unlike')
      $('#numberOfLikes').text( numberOfLikes+1)
    } else {
      $(this).val('Like')
      $('#numberOfLikes').text( numberOfLikes-1)
    }
  })
})

//TODO: Do an AJAX Request to avoid unfinishing POST request (e.g. when we do not res.redirect)
