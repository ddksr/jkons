/**
 * jKons ***********
 * VALIDATION module
 * *****************
 * 
 * Validation functions for HTML forms. Module also includes
 * a JQuery plugin for easier usage.
 * 
 * Dependancies:
 * - jkons.js
 * - jkons.ajax.js (ONLY when using isUnique())
 * - JQuery
 */
(function( $ ) {
	jk.val = {
		stack: [],
		helpers: {
			isUnique: function(f, name, model, exc) {
				var val = $(f).val();
				if (!val || val === "") return true;
				var data = {
					field: name,
					model: model,
					value: val
				};
				if(exc) data["exception"] = exc;
				return jk.ajax.sendAndGet("api/is_unique", data).data;
			},
			isValidEmail: function(f) {
				var val = $(f).val();
				if (!val || val === "") return true;
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(val);
			},
			isValidUrlName: function(f) {
				var val = $(f).val();
				if (!val || val === "") return true;
				var re = /^[\w\d_\-]*$/;
				return re.test(val);
			},
			isNumeric: function(f){
				var val = $(f).val();
				if (!val || val === "") return true;
				val = (""+val).replace(/[,\.]/g, jk.L10n.DECIMAL_SEPERATOR);
				return parseFloat(val) != val; 
			},
			isFloat: function(f) {
				return jk.val.helpers.isNumeric(f);
			},
			isInt: function(f) {
				var val = $(f).val();
				if (!val || val === "") return true;
				return parseFloat(val) != val;  
			},
			matches: function (f1, f2) {
				return $(f1).val() == $(f2).val();
			},
			required: function (f) {
				var val = $(f).val();
				return val && val.length > 0;
			},
			hasLength: function (f, len) {
				var val = $(f).val();
				if (!val || val === "") return true;
				return val.length === len;
			},
			hasMinLength: function (f, len) {
				var val = $(f).val();
				if (!val || val === "") return true;
				return val.length >= len;
			},
			hasMaxLength: function (f, len) {
				var val = $(f).val();
				if (!val || val === "") return true;
				return val.length <= len;
			},
			hasLengthInRange: function (f, from, to) {
				var val = $(f).val();
				if (!val || val === "") return true;
				return val.length >= from && val.length <= to;
			}
		},
		toStack: function (validator, responseField, responseMessage) {
			jk.val.stack.push({
				validator: validator,
				responseField: responseField,
				responseMessage: responseMessage
			});
		},
		run: function (evt) {
			var inSubmit = false;
			if (evt) {
				inSubmit = true;
			}
			var status = true;
			$.each(jk.val.stack, function(i, val) {
				$(val.responseField).html("");
			});
			$.each(jk.val.stack, function(i, val) {
				var result = val.validator();
				if (! result && $(val.responseField).length > 0 && val.responseMessage) {
					$(val.responseField).html(val.responseMessage);
				}
				status = status && result;
			});
			if (inSubmit) {
				if (!status) evt.preventDefault(); // so submit doesn't do anything stupid
			}
			else return status;
		}
	};
	$.fn.jkVal = function(validator, params, responseField, responseMessage, onBlur) {
		if (!validator || validator === "run") {
			return $(this).click(jk.val.run);
		}
		else {
			var fun = (validator === "run") ? jk.val.run : jk.val.helpers[validator];
			if (!fun) return this;
			if (!params) params = [];
			if (!$.isArray(params)) params = [params];
			return this.each(function() {
				params.unshift(this);
				jk.val.toStack(function() {
					fun.apply(null, params);
				}, responseField, responseMessage);
				if (onBlur !== false && $(responseField).length > 0 && responseMessage) {
					$(this).blur(function() {
						var result = fun.apply(null, params);
						if (! result) {
							$(responseField).html(responseMessage);
						}
					});
					$(this).focus(function() {
						$(responseField).html("");
					});
				}
			});
		}
	}
}( jQuery ));