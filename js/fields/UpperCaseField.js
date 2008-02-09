/**
 * A field where the value is always uppercase
 *
 * @class inputEx.UpperCaseField
 * @extends inputEx.Field
 */
inputEx.UpperCaseField = function(options) {
   inputEx.UpperCaseField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UpperCaseField, inputEx.Field);

/**
 * Override onInput to set the value to upper case
 */
inputEx.UpperCaseField.prototype.onInput = function(e) { 
	this.setValue( (this.getValue()).toUpperCase() );
	this.setClassFromState();
};
