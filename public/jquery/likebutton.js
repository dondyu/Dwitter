$(document).ready(function(){
  $('.likeButton').click(function(){
    console.log('hey');
    var id = $(this).attr('id');
    console.log(id);
    var numberOfLikes =  $('.'+id).text(); //TODO: figure out how to refer to this ID
    console.log(numberOfLikes)
    var numberOfLikes = parseInt(numberOfLikes)
    if($(this).val()==='Like'){
      $(this).val('Unlike')
      $('.'+id).text( numberOfLikes+1)
    } else {
      $(this).val('Like')
      $('.'+id).text( numberOfLikes-1)
    }
  })
})

//TODO: Do an AJAX Request to avoid unfinishing POST request (e.g. when we do not res.redirect)
