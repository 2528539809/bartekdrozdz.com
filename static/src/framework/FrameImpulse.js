FrameImpulse = (function() {

    var lastTime = 0;
    var vendors = ['webkit', 'moz'];

    for(var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { 
            	callback(currTime + timeToCall); 
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    var fps = document.getElementById("fps");
    var lastTime = 0, frameIndex = 0;
    var sumFrame = 0, avgFrame = 0, avgFPS = 0;

    if(fps) {
		fps.style.opacity = 0;
		document.addEventListener('keydown', function(e) {
			if(e.keyCode == 32) {
				fps.style.opacity = 1;
			}
		});
	}

	var calculateFPS = function(deltaTime) {

		if(frameIndex >= 60) {
			frameIndex = 0;
			sumFrame = 0;
		}

		var frameTime = (deltaTime - lastTime);
		lastTime = deltaTime;

		sumFrame += frameTime;
		avgFrame = sumFrame / (frameIndex+1);
		avgFPS = 1000 / avgFrame;

		frameIndex++;


		if(!fps) return;

		if(avgFrame > 20) {
			fps.innerHTML = '<b>'+(avgFrame|0)+'</b> | ' + (avgFPS|0);
		} else {
			fps.innerHTML = (avgFrame|0) + ' | ' + (avgFPS|0);
		}
	}

	var r = {};
	var listeners = [], numListeners = 0, toRemove = [], numToRemove;

	var run = function(deltaTime) {
		requestAnimationFrame(run);

		calculateFPS(deltaTime);

		if(numListeners == 0) return;

		//var i = numListeners;
		//while(i--) {
		for(var i = 0; i < numListeners; i++) {
			listeners[i].call(deltaTime);
		}

		if(numToRemove > 0) {
			
			for(var i = 0; i < numToRemove; i++) {
				listeners.splice(toRemove[i], 1);
				// console.log("FrameImpulse > removed listener > total :", numListeners);
			}

			numListeners = listeners.length;
			toRemove = [];
			numToRemove = 0;
		}		
	}

	r.on = function(f) {
		if(listeners.indexOf(f) > -1) {
			return;
		}

		listeners.push(f);
		numListeners = listeners.length;
		// console.log("FrameImpulse > new listener > total :", numListeners);
	}

	r.off = function(f) {
		toRemove.push(f);
		numToRemove = toRemove.length;
		// console.log("FrameImpulse > scheduled removal > total :", numListeners);
	}
	
	run();
	return r;

})();
