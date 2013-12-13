HistoryRouter = function (broadcast) {

	var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
	if(document.location.port) rootUrl += ":" + document.location.port;

	console.log("rootUrl", rootUrl);
	
	var route, prevRoute;

	var hijackLinks = function () {
		if (!Simplrz.history) return;

		var allLinksSelector = 'a[href]';
		var allLinks = EXT.selectAll(allLinksSelector);

		for (var i = 0; i < allLinks.length; i++) {
			var link = allLinks[i];

			var url = link.ext.attr('href');
			var target = link.ext.attr('target');
			var hj = link.ext.attr('data-hj');

			if(url.indexOf(':') > -1 || target == '_blank' || hj == "no") {
				// console.log('HistoryRouter.hijackLinks: skipping', url);
				continue;
			}
			
			if (!link.hijacked) {
				link.hijacked = true;
				link.addEventListener('click', function (e) {
					e.preventDefault();
					pushState(this.href);
				});
			}
		}
	};

	var notify = function() {
		var r = route.replace(rootUrl, "");
		var p = r.split("/");
		p.shift(); // Remove the first empty element

		broadcast.trigger(MSG.ROUTE, {
			route: r,
			parts: p,
			prevRoute: prevRoute
		});
	}

	var pushState = function (href) {
		if (Simplrz.history) history.pushState(null, null, href);
		prevRoute = (route) ? route.replace(rootUrl, "") : null;
		route = document.location.href;
		notify();
	};

	window.addEventListener('popstate', function(e) {
		prevRoute = (route) ? route.replace(rootUrl, "") : null;
		route = document.location.href;
		notify();
	});

	broadcast.on(MSG.HIJACK_LINKS, hijackLinks);
	broadcast.on(MSG.NAVIGATE, pushState);

	return {
		init: function () {
			hijackLinks();
		}
	}
};