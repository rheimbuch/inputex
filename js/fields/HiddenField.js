(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Create a hidden input, inherits from inputEx.Field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.HiddenField = function(options) {
	inputEx.HiddenField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.HiddenField, inputEx.Field, 
/**
 * @scope inputEx.HiddenField.prototype   
 */   
{
   
/**
 * Doesn't render much...
 */
render: function() {
   this.type = inputEx.HiddenField;
	this.divEl = inputEx.cn('div');
},

/**
 * No events to register
 *
initEvents: function() {},*/

/**
 * Stores the value in a local variable
 */
setValue: function(val) {
   this.value = val;
},

/**
 * Get the previously stored value
 */
getValue: function() {
   return this.value;
}

});
   
/**
 * Register this class as "hidden" type
 */
inputEx.registerType("hidden", inputEx.HiddenField);

})();