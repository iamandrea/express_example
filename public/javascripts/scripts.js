jQuery(function($){

	var navActive = false;

	$(".container").parallax();

    function navSelect() {
	  	navActive = true;
     	$(".nav").removeClass('inactive').addClass('active');
	    $('.navBackground').css('display', 'block');
	    setTimeout(function(){
	      $('.navBackground').css('opacity', 1);
	    }, 50);
    }

    function navDeselect() {
	  	navActive = false;
     	$(".nav").removeClass('active').addClass('inactive');
	    setTimeout(function(){
	      $('.navBackground').css('opacity', 0);
	      setTimeout(function(){
    	    $('.navBackground').css('display', 'none');
	      }, 100);
	    }, 50); 	
    }

	$( ".nav" ).click(function() {
	  if ( navActive === false ) {
	  	navSelect();
	  } else if ( navActive === true ) {
	  	navDeselect();
	  }
	});

});

