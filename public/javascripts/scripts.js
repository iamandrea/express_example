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
			$('.selected').removeClass('selected');
			self.addClass('selected');
			selected = self.attr('class').split(' ')[1];
			setTimeout(function(){
				$('.page-' + selected).addClass('selected');
			}, 600);

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

	// var slides;

	//   slides = new Slider();
	//   slides.init({
	//     itemClass: 'item',
	//     onSlideChange: function() {
	// 	  var currentSlide = slides.currentSlide() + 1;
	// 	  if (currentSlide === 1 ) {
	// 	    var prevSlide = 4;
	// 	    var nextSlide = 2;
	// 	  } else if (currentSlide === 4) {
	// 	    var prevSlide = 3;
	// 	    var nextSlide = 1;
	// 	  } else {
 //     		var prevSlide = currentSlide - 1;		  	
 //     		var nextSlide = currentSlide + 1;		  	
	// 	  }

	//       $('.pg-' + currentSlide).addClass('selected');
	//       $('.pg-' + prevSlide + ', .pg-' + nextSlide).removeClass('selected');
	//     },
	//     timeout: 8000
	//   });

	//   $('.left-arrow').click(function() {
	//     slides.prevSlide();
	//   });

	//   $('.right-arrow').click(function() {
	// 	slides.nextSlide();
	//   });


	$('.slides').slick({
		  dots: true,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 1
	});


});



