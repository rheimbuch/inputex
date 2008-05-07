/**
 * @class Create a hidden input, inherits from inputEx.Field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.HiddenField = function(options) {
	inputEx.HiddenField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.HiddenField, inputEx.Field);
   
/**
 * Doesn't render much...
 */
inputEx.HiddenField.prototype.render = function() {
   this.type = inputEx.HiddenField;
	this.divEl = inputEx.cn('div');
};

/**
 * No events to register
 *
inputEx.HiddenField.prototype.initEvents = function() {};*/

/**
 * Stores the value in a local variable
 */
inputEx.HiddenField.prototype.setValue = function(val) {
   this.value = val;
};

/**
 * Get the previously stored value
 */
inputEx.HiddenField.prototype.getValue = function() {
   return this.value;
};
   
/**
 * Register this class as "hidden" type
 */
inputEx.registerType("hidden", inputEx.HiddenField);