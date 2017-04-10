$(document).ready(function(){
  $('.likeButton').click(function(){
    var id = $(this).attr('id');
    var numberOfLikes =  parseInt($('.'+id).text()); 
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
