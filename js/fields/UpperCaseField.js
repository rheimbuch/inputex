/**
 * A field where the value is always uppercase
 *
 * @class inputEx.UpperCaseField
 * @extends inputEx.Field
 */
inputEx.UpperCaseField = function(options) {
   inputEx.UpperCaseField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UpperCaseField, inputEx.Field, {
   setValue: function(val) {
      this.el.value = val.toUpperCase();
   },
   onInput: function(e) { 
   	this.setValue( (this.getValue()) );
   	this.setClassFromState();
   }
});
