/**
 * jKons *****
 * AJAX module
 * ***********
 * 
 * Module for AJAX communications with the server.
 * 
 * IMPORTANT: function suspects server's answer in form:
 * response = {message: string, status: bool, data: object}
 * Fields:
 *  - status: true if everything went OK, false if anny errors
 *  - data: any type of response data when everything wen't OK (status==true)
 *  - message: any message from server. If status==false, the message contains
 *    the error description
 * 
 * Depends on
 * - jkons.js
 * - JQurey
 */
(function( $ ) {
	jk.ajax = {
		/**
		 * AJAX function for sending data to server at siteUrl+'uri'.
		 * Other arguments:
		 * - data: data passed to server
		 * - callback: function callback on success
		 * - method: POST or GET
		 * - settings: $.ajax additional parameters JSON
		 * @param string uri
		 * @param JSON data
		 * @param function callback
		 * @param string method
		 * @param JSON settings
		 */
		sendAndCall: function(uri, data, callback, method, settings) {
			var defaults = {
				method: method,
				url: jk.url.siteUrl(uri ? uri : ""),
				data: data ? data : {},
				success: callback
			};
			defaults = jk.util.parseIn(defaults, settings);
			$.ajax(defaults);
		},
		sendAndCallJsonp: function() {},
		/**
		 * AJAX function for sending data to server at siteUrl+'uri' and geting
		 * the result in sync. 
		 * Function returns the response.data field from server.
		 * 
		 * Other arguments:
		 * - data: data passed to server
		 * - callback: function callback on success
		 * - method: POST or GET
		 * - settings: $.ajax additional parameters JSON
		 * @param string uri
		 * @param JSON data
		 * @param function callback
		 * @param string method
		 * @param JSON settings
		 * @returns object
		 */
		sendAndGet: function(uri, data, method, settings) {
			var result = undefined;
			var defaults = {
				method: method ? method : "POST",
				url: jk.url.siteUrl(uri ? uri : ""),
				data: data ? data : {},
				success: function(resp) {
					result = resp;
				},
				error: function(resp) {
					
				},
				async: false
			};
			defaults = jk.util.parseIn(defaults, settings);
			$.ajax(defaults);
			return result;
		},
		sendAndEval: function(uri, data, callback, method, settings) {
			var defaults = {
				method: method ? method : "POST",
				url: jk.url.siteUrl(uri ? uri : ""),
				data: data ? data : {},
				success: function(resp) {
					if(resp.status) {
						callback(resp.data);
					}
					else {
						alert(resp.message);
					}
				}
			};
			defaults = jk.util.parseIn(defaults, settings);
			$.ajax(defaults);
		}
	};
}( jQuery ));