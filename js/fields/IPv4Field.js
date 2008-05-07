/**
 * @class Adds an IPv4 address regexp
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.IPv4Field = function(options) {
	inputEx.IPv4Field.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IPv4Field, inputEx.StringField);
   
/**
 * set IPv4 regexp and invalid string
 */
inputEx.IPv4Field.prototype.setOptions = function() {
   inputEx.IPv4Field.superclass.setOptions.call(this);
   this.options.messages.invalid = inputEx.messages.invalidIPv4;
   this.options.regexp = inputEx.regexps.ipv4;
};   

// Specific message for the email field
inputEx.messages.invalidIPv4 = "Invalid IPv4 address, ex: 192.168.0.1";

/**
 * Register this class as "IPv4" type
 */
inputEx.registerType("IPv4", inputEx.IPv4Field);
