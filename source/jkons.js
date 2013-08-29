/**
 * Default JKONS file with only necessary lib util functions
 * and global variables + constants
 * 
 * Depends on:
 * - JQuery
 */
(function( $ ) {
	jk = {};
	
	jk.BASE_URL = ''; // Should be set in headers!!
	jk.LANG = undefined; // Should be set in headers!!
	
	jk.L10n = {
		DECIMAL_SEPERATOR: "."
	};
	
	jk.url = {
		/**
		 * Create anchor HTML element with href attribute 'url'.
		 * If url has no 'http' prefix, site url will be prepended.
		 * If Additional data is defined, it will be parsed to JQuery
		 * attr() function.
		 * @param string url
		 * @param string text
		 * @param JSON additional
		 * @returns JQuery object
		 */
		anchor: function(url, text, additional) {
			if (url.substr(0,4).toLowerCase() !== "http") url = jk.url.siteUrl(url);
			var a = $(document.createElement("a"));
			if (additional !== undefined) $(a).attr(additional);
			if (text === undefined) text = url;
			return $(a).attr("href", url).text(text);
		}, //TODO: test
		
		/**
		 * Function prepends site url to 'url' argument.
		 * @param string url
		 * @returns string
		 */
		siteUrl: function(url) {
			return jk.BASE_URL + url;
		}, //TODO: test
		
		hash: function(val) {
			if (val) window.location.hash = val;
			else return document.URL.substr(document.URL.indexOf('#')+1); // should be safe for IE
		},
		
		/**
		 * Redirect to specified URL.
		 * @param string url
		 * @returns {undefined}
		 */
		redirect: function(url) {
			if (url.substr(0,4).toLowerCase() !== "http") url = jk.url.siteUrl(url);
			window.location.href = url;
		} //TODO: test
	};
	
	jk.util = {
		/**
		 * Parse key=>object pairs from 'additional' into 'defaults'. 
		 * Function overwrites keys in 'defaults'.
		 * @param JSON defaults
		 * @param JSON additional
		 * @returns {unresolved}
		 */
		parseIn: function(defaults, additional) {
			if (additional) {
				$.each(additional, function (key, val) { defaults[key] = val; });
			}
			return defaults;
		}//TODO: test
	};
}( jQuery ));