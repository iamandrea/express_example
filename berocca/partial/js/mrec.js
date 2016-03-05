// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var score = { 
	amount: 0
}

var initialState = {
	tap: false
}

var gameState = {
	active: true
}

var NinjaGame = function (canvasElement) {

	var ctx = canvasElement.getContext('2d');
	var $tapToKick = $("#tap-to-kick");
	var $gameFrame = $("#game-frame");
	var $interlude = $("#interlude");
	var $endFrame = $("#end-frame");
	var $timer = $(".timer");
	var $ninja = $(".ninja");
	var replay = false; 
	var fps = 24;
	var totalTablets = 1;
	var tablets = [];
	var block = {
	    x: 50,
	    y: 200,
	    width: 10,
	    height: 10
	}
	var glass = {
	    x: 252,
	    y: 230,
	    width: 20,
	    height: 200
	}

	timer = new Timer();
	setTimeout(function(){
		addTablet();
	}, 500);
	setupListeners();
	gameLoop();
	
	function addTablet() {
	   tablets.push(new Tablet());
	}

	function clearTablets() {
		tablets = [];
	}

	function kickNinja(){
		
		$ninja.addClass('kick');
		block.x = 110;
		setTimeout(function(){
			block.x = 60;
		},200);
		setTimeout(function(){
			$ninja.removeClass('kick');
		},500);
	}

	function isColliding(a, b) {
	    return !(
	    b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
	}

	function updateTablets() {
		 for (var i = 0; i < tablets.length; i++) {
	        var tablet = tablets[i];

		    tablet.updatePosition();

	        if (isColliding(tablet, block)) {
	        	tablet.state = Tablet.KICKED;
	        }

	        if (isColliding(tablet, glass)) {
	        	score.amount += 1;
	        	if (score.amount == NinjaGame.AMOUNT_TO_WIN){
	        		// clearTablets();
	        		if (!replay){
	        			gameState.active = true;
	        			timer.startInterval();
		        		replay = true; 
		        		setTimeout(function(){
			        		// $gameFrame.addClass("slide-left");
			        		// $interlude.addClass("slide-in");
			        		setTimeout(function(){
								$timer.addClass("slide-down");
			        		},500);
						},500);
	        		}
	        		else if (replay){

	        		}
	        	}
		        if (score.amount <= 9) {
		            $(".score").html("0" + score.amount);
		        }
		        else if (score.amount >= 10 ) {
		            $(".score").html(score.amount);
		        }
	        	
				$(".pink-water").addClass('fizzle');
				$(".bubble-1, .bubble-2, .bubble-3").addClass('bubble-up');
					setTimeout(function(){
						$(".pink-water").removeClass('fizzle');
						$(".bubble-1, .bubble-2, .bubble-3").removeClass('bubble-up');
					},3000);
	        	tablet.reset();
	        }
	       
			if (tablet.y > 279) {
	            tablet.reset();
	        }
	    }
	}

	function gameLoop () {
		updateTablets();
		drawScene();
		// if(/(iPhone|iPad|iPod)\sOS\s6/.test(navigator.userAgent)) {
  //   		setInterval(function(){
  //   			gameLoop();
  //   		},1000/fps);
		// }
		// else{
			
		// }
		window.requestAnimationFrame(gameLoop);
	};

	function drawScene() {
			ctx.clearRect(0,0, canvasElement.width, canvasElement.height)
			ctx.fillStyle = "transparent";
	        ctx.fillRect( block.x, block.y, block.width, block.height);

			ctx.fillStyle = "transparent";
	        ctx.fillRect( glass.x, glass.y, glass.width, glass.height);

		    for (var i = 0; i < tablets.length; i++) {
		        var tablet = tablets[i];
		        ctx.drawImage( tablet.img, tablet.x, tablet.y, tablet.width, tablet.height);
		    }
	};




	function setupListeners(){

		$("#container").hammer().on("tap", function(e) { 
			if (gameState.active){
				if (!initialState.tap) {
					initialState.tap = true;
					$tapToKick.addClass('fadeOut');
					kickNinja();
					setTimeout(function(){
						$tapToKick.css('display', 'none');
					},1000);
				}
				else if (initialState.tap){		
					kickNinja();
				}
			}
		});
		$("#back-to-game").hammer().on("tap", function(e) { 
			gameState.active = true;	
    		$gameFrame.removeClass("slide-left").addClass("slide-back");
    		$interlude.removeClass("slide-in").addClass("slide-right");
			timer.startInterval();
		});

		$(".replay").hammer().on("tap", function(e) { 	
    		score.amount = 0;
    		$(".score").html("00");
			timer.resetInterval();
			setTimeout(function(){
				gameState.active = true;
	    		$gameFrame.removeClass("slide-left").addClass("slide-back");
	    		$endFrame.removeClass("slide-in").addClass("slide-right");
				timer.startInterval();
			}, 200);
		});

	}
};
NinjaGame.AMOUNT_TO_WIN = 1;

var Tablet = function () {

	var TABLET_SRC = "../pub/img/tablet-small-2x.png";

	this.width = 29;
	this.height = 29;
	this.img = new Image();
	this.img.src = TABLET_SRC;
	this.x = 90;
    this.y = -50;
    this.speed = 3;
    this.state = Tablet.FALLING;
	
	this.reset = function () {
	    this.x = 90;
	    this.y = -50;
	    this.speed = 3;
	    this.state = Tablet.FALLING;
	}
	this.reset();

	this.updatePosition = function (){

		var _this = this;

		//how much time has elapsed?
		var timeNow = new Date().getTime();

		var deltaTime = this.lastTime ? (timeNow - this.lastTime) / 1000 : 0;
		var deltaX = 0;
		var deltaY = 0;
		
		if (this.state == Tablet.FALLING ){
			this.y += Tablet.FALL_SPEED * deltaTime;
		}
		else if (this.state == Tablet.KICKED){
			if(!this.kickStartY)
				this.kickStartY = this.y;
			if(!this.kickStartX)
				this.kickStartX = this.x;

			function getBallPathY(x) {
				var q = Tablet.QUADRATIC;
				return ((q.a*x*x)-(q.b*x)+q.c);
			}
			this.x += Tablet.KICK_SPEED * deltaTime;
			this.y = getBallPathY(this.x); 

			// setTimeout(function(){
			// 	_this.state = Tablet.SOME_OTHER_STATE;
			// },325);
		
		}
		else if (this.state == Tablet.SOME_OTHER_STATE ){
			this.x += Tablet.FALL_SPEED * deltaTime;
			this.y = Tablet.KICK_SPEED * deltaTime;
			setTimeout(function(){
				_this.state = Tablet.FALLING;
			},300);
		}



		this.lastTime = timeNow;
	}
};
Tablet.FALL_SPEED = 150; //pixels per second;
Tablet.KICK_SPEED = 200; //pixels per second;
Tablet.FALLING = 1;
Tablet.KICKED = 2;
Tablet.SOME_OTHER_STATE = 3;
Tablet.QUADRATIC = {
	a: 0.0111,
	b: 2.83,
	c: 235
}

var Timer = function(){
   
   var counter = 30;
   var timerInterval = null;
   var $seconds = $(".seconds");
   var $gameFrame = $("#game-frame");
   var $endFrame = $("#end-frame");

   function countdown(){
   		if (counter == 30){
   			$seconds.html(counter);
   		}
    	if (counter <= 0 ) {
    		gameState.active = false;

    		setTimeout(function(){
				$gameFrame.removeClass('slide-back').addClass('slide-left');
	    		$endFrame.addClass('slide-in');
	        	stopInterval();
	        	counter--;
		        if (score.amount <= 9) {
			        $(".final-score").html( "0" + score.amount);
		        }
		        else if (score.amount >= 9) {
			        $(".final-score").html( score.amount);
		        }  
		    },1000);    	
        }
        else if (counter <= 10 ) {
            counter--;
	        $seconds.html( "0" + counter);
        }
        else if (counter >= 10 ) {
            counter--;
	        $seconds.html( counter);
        }
    }
    function resetInterval() {
       clearInterval(timerInterval);
       counter=30;
    }
    function startInterval() {
       $seconds.html(counter);
       timerInterval = setInterval(countdown, 1000);
    }
    function stopInterval() {
       clearInterval(timerInterval);
    }

    return {
    	resetInterval: resetInterval, 
    	startInterval: startInterval
    }

};

var canvas = document.getElementById("game")
var ninjaGame = new NinjaGame(canvas);
