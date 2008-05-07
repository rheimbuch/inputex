/**
 * @class A field where the value is always uppercase
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UpperCaseField = function(options) {
   inputEx.UpperCaseField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UpperCaseField, inputEx.StringField);

inputEx.UpperCaseField.prototype.setValue = function(val) {
      this.el.value = val.toUpperCase();
};

inputEx.UpperCaseField.prototype.onInput = function(e) { 
   	this.setValue( (this.getValue()) );
   	this.setClassFromState();
};

