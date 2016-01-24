jQuery(function($){

	var navActive = false;

	$(".container").parallax();

    function navSelect() {
	  	navActive = true;
     	$(".nav").removeClass('inactive').addClass('active');
	    $('.navBackground').css('display', 'block');
	    $('.navcontainer').addClass('on');
	    setTimeout(function(){
	      $('.navBackground').css('opacity', 1);
	    }, 50);
    }

    function navDeselect() {
	  	navActive = false;
     	$(".nav").removeClass('active').addClass('inactive');
    	$(".navcontainer").removeClass('on');
	    setTimeout(function(){
	      $('.navBackground').css('opacity', 0);
	      setTimeout(function(){
    	    $('.navBackground').css('display', 'none');
	      }, 100);
	    }, 50); 	
    }

	$( ".navigationurl" ).click(function() {

		if (!$(this).hasClass('selected')){
			var self = $(this);
			($('.selected').removeClass('selected'));
			$(this).addClass('selected');
			selected = self.attr('class').split(' ')[1];	
			$('.page-' + selected).addClass('selected');
		}
	});

	$( ".nav" ).click(function() {
	  if ( navActive === false ) {
	  	navSelect();
	  } else if ( navActive === true ) {
	  	navDeselect();
	  }
	});

	$( ".navcontainer" ).click(function() {
	  if ( navActive === true ) {
	  	navDeselect();
	  }
	});

	$( ".right-arrow" ).click(function() {

	});	

});

