Hero = function(container) {

	var hi = {};
	var ASPECT = 2.35;
	var ctn;
	var isDemo, isWide;

	var fadeIn = function() {
		ctn.ext.transition({ opacity: 1 }, 400, 'ease-out');
	}

	hi.setup = function(data) {

		var missingDeps = [];
		data.deps.forEach(function(dep) {
			if(!Simplrz[dep]) {
				missingDeps.push(dep);
			}
		});

		isDemo = (data.type == 'demo' && missingDeps.length == 0);
		isWide = window.innerWidth > 1024;

		ctn = EXT.create(isDemo ? 'iframe' : 'img');
		ctn.ext.attr('frameborder', 0);
		ctn.ext.css('opacity', 0);
		ctn.ext.on('load', fadeIn);
		var folder = (isWide) ? 'assets/content/1920w-235as/' : 'assets/content/871sq/';
		ctn.src = isDemo ? data.url : folder + data.id + '.jpg';
		
		hi.adjust();
		container.innerHTML = '';
		container.appendChild(ctn);
	}

	hi.adjust = function() {
		var h, w, ox;
		
		if(isWide) {
			if(isDemo) {
				h = hi.height();
				w = window.innerWidth;
				ox = 0;
			} else {
				h = hi.height();
				w = h * ASPECT;
				ox = (w - window.innerWidth) * -0.5;
			}
		} else {
			h = w = window.innerWidth;
			ox = 0;
		}

		container.ext.height(h);

		if(ctn) {
			ctn.ext.height(h);
			ctn.ext.width(w);
			ctn.ext.transform({ x: ox });
		}
	}

	hi.killIframe = function() {
		if(ctn) {
			try {
				ctn.contentWindow.kill();
			} catch(e) {
				// Np
			}
		}
	}

	hi.kill = function() {
		if(ctn) {
			container.removeChild(ctn);
			ctn.innerHTML = "";
			ctn = null;
		}
	}

	hi.height = function() {
		return isWide ? Math.max(window.innerWidth / ASPECT, window.innerHeight * 0.75) : window.innerWidth;
	}

	hi.onResize = function() {
		hi.adjust();
	}

	hi.ext = container.ext;
	
	return hi;

}