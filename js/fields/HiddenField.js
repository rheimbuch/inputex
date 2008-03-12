/**
 * @class inputEx.HiddenField
 * Create a hidden input, inherits from inputEx.Field
 */
inputEx.HiddenField = function(options) {
	inputEx.HiddenField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.HiddenField, inputEx.Field, {
   
   render: function() {
      this.type = inputEx.HiddenField;
   	this.divEl = inputEx.cn('div');
   },
   
   initEvents: function() {},
   
   setValue: function(val) {
      this.value = val;
   },
   
   getValue: function() {
      return this.value;
   }
   
});

/**
 * Register this class as "hidden" type
 */
inputEx.registerType("hidden", inputEx.HiddenField);