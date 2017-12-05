// A $( document ).ready() block.
jQuery( document ).ready(function() {
  var $ = jQuery.noConflict();

  $(document).on('click', '[data-toggle="lightbox"]', function(event) {
      event.preventDefault();
      $(this).ekkoLightbox();
  });

  var images = $.get("http://" + window.location.host + "/images").then(function(images){
    images.map(function(file){
      var thumb = null
      var str = null
      var thumb = 'images/thumbs/' + file
      var file = 'images/' + file
      if(file.toLowerCase().indexOf(".mp4") > -1 || file.toLowerCase().indexOf(".webm") > -1){
        thumb = 'resources/play.jpg'
        str = '<video class="example-video" width="320" height="240" controls><source src="'+ file + '" type="video/mp4"></video>'
      }else{
        str = '<a class="example-image-link" href="'+ file  +'" data-toggle="lightbox" data-gallery="gallery"><img class="example-image" src="'+thumb+'" alt=""/></a>'
      }
      //var str = '<a class="example-image-link" href="'+ file  +'" data-lightbox="example-set" data-title="Click the right half of the image to move forward."><img class="example-image" src="' + thumb + '" alt=""/></a>'
      $("body #images").append(str)
    });
    // $('.example-image-link').click(function (e) {
    //     e.preventDefault();
    //     $(this).ekkoLightbox();
    // });
  })
  //console.log(images.responseJSON)
  // (function loop(){
  //   if(!images.responseJSON){
  //     setTimeout(loop, 1000)
  //   }
    // images.responseJSON.map(function(file){
    //   file = 'images/' + file
    //   var str = '<a class="example-image-link" href="'+ file  +'" data-lightbox="example-set" data-title="Click the right half of the image to move forward."><img class="example-image" src="'+file+'" alt=""/></a>'
    //   $("body #images").append(str)
    // });
  // })()
});
