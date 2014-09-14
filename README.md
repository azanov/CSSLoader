CSSLoader
=========

What is it about
-----

Mobile websites nowadays are often required to look well on many different devices and screen resolutions. 
We often use media queries to conditionally apply stylesheets, such as:

```html
<link rel="stylesheet" href="213.css" media="only screen and (max-width: 239px)">
<link rel="stylesheet" href="240.css" media="only screen and (min-width: 240px) and (max-width: 319px)">
<link rel="stylesheet" href="320.css" media="only screen and (min-width: 320px) and (max-width: 359px)">
<link rel="stylesheet" href="360.css" media="only screen and (min-width: 360px) and (max-width: 383px)">
...
<link rel="stylesheet" href="213.css" media="only screen and (min-width: 1280px)">
```

The problem
-----

Considering all devices available on the market now, you will need to supply **over 20** different stylesheets. 

If you're naive enough, you will think that the browser will only download the stylesheets with media queries which evaluate to true. 
But you're mistaken - the browser will download **all** stylesheets, yet not apply them. This will slow down your mobile website. 

How CSSLoader will help you
-----

With CSSLoader you can specify all your stylesheets once - and it will only download the stylesheets required for the current screen resolution. 

### Quickstart

Make sure all your CSS files contain the following rule:

```css
	body {
		cursor: default
	}
```

Then setup the page as following:

```html
<style>
	/* 
		Add this style before loading any stylesheets.
		It's magic to allow callbacks when your CSS files are ready
	*/
	body { cursor: wait }
</style>

<script src="CSSLoader.js"></script>

<script>
	var loader = new CSSLoader({
	
		// Specify the path to load your stylesheets from, {w} is the width
		path: '/styles/{w}.css',
		
		// Specify the viewport widths you support
		widths: [
			213, 240, 320, 360,
			384, 400, 424, 427,
			480, 512, 533, 540,
			568, 569, 600, 640,
			720, 753, 768, 800,
			854, 960, 1280
		]
		
	});
	
	// Load the stylesheets
	loader.load();
	
</script>
```

### How can I tune CSSLoader and use callbacks?

```javascript
	loader.load({
	
		// Maximum time in milliseconds to download a stylesheet, once over, will result in timeout
		maxWaitTime: 5000,
		
		// How often to check if the stylesheet has been downloaded (in milliseconds)
		stepTime: 50,
		
		beforeRequest: function () {
			// Called before a stylesheet file starts loading
			// Called ONCE per file
		},
		
		timeout: function () {
			// Called when the maximum wait time is exceeded
			// Can be due to network errors or wrong CSSLoader callback configuration
		},
		
		success: function (timeEllapsed) {
			// Called when a stylesheet has finished loading
			// Called ONLY when the file is newly loaded
		},
		
		complete: function () {
			// Called when a stylesheet loaded before is now applied again
			// e.g - on rotation
		}
		
	});
```

### Using CSSLoader to load stylesheets when the screen is rotated (using jQuery)

```javascript
	
	// loader = previously created CSSLoader
	
	$(window).on('resize', function () {
		loader.load();
	});
	
```

Credits
-----

This script has been created during a project in [CSSSR](http://csssr.ru) - the amazing frontend studio.