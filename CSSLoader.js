var CSSLoader = function(options) {
	
	this.path = options.path || '/{w}.css';
	this.widths = options.widths || [];
	this.stylesheets = {};
	
	this.head = document.getElementsByTagName('head')[0];
	
	for(var i = 0; i < this.widths.length; i++) {
		var width = this.widths[i],
			maxWidth = (i + 1 == this.widths.length) ? false : this.widths[i + 1] - 1;
		
		query = 0 === i ? 
			"(max-width: " + maxWidth + "px)" : 
			maxWidth ? 
				"(min-width: " + width + "px) and (max-width: " + maxWidth + "px)" : 
				"(min-width: " + width + "px)";
		
		this.stylesheets[width] = {
			query: query,
			url: this.path.replace(/\{w\}/ig, width),
			width: width
		}
	}
};

CSSLoader.prototype = {
	__createLink: function (stylesheet) {
		var lnk = document.createElement('link');
		lnk.id = '__cls' + stylesheet.width;
		lnk.href = stylesheet.url;
		lnk.rel = 'stylesheet';
		lnk.media = 'only screen and ' + stylesheet.query;
		this.head.appendChild(lnk);
	},
	load: function (params) {
		params = params || {};
		
		var maxWaitTime = params.maxWaitTime || 5000,
			stepTime = params.stepTime || 50,
			alreadyWaitedTime = 0,
			stylesheet = null,
			
			wait = function () {
				var startTime = +new Date(),
					endTime;

				setTimeout(function () {
					endTime = +new Date();
					alreadyWaitedTime += (endTime - startTime);
					if (alreadyWaitedTime >= maxWaitTime) {
						params.timeout && params.timeout();
					} else {
						if (window.getComputedStyle(document.body).getPropertyValue('cursor') === 'default') {
							params.success && params.success(alreadyWaitedTime);
						} else {
							wait();
						}
					}
				}, stepTime);
			};
			
		for(var width in this.stylesheets) {					
			if( this.stylesheets.hasOwnProperty( width ) ) {
				stylesheet = this.stylesheets[ width ];
				
				if( matchMedia( stylesheet.query ).matches ) {
					if(!document.getElementById('__cls' + stylesheet.width)) {
						params.beforeRequest && params.beforeRequest();
						this.__createLink(stylesheet);
						wait();
					}
					else if(params.complete) {
						params.complete();
					}
				}
			}
		}
	}
};