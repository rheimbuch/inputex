(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class A field where the value is always uppercase
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UpperCaseField = function(options) {
   inputEx.UpperCaseField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UpperCaseField, inputEx.StringField, 
/**
 * @scope inputEx.UpperCaseField.prototype   
 */   
{

   /**
    * Set the value and call toUpperCase
    * @param {String} val The string
    */
   setValue: function(val) {
      this.el.value = val.toUpperCase();
   },

   /**
    * Call setvalue on input to update the field with upper case value
    * @param {Event} e The original 'input' event
    */
   onInput: function(e) { 
   	this.setValue( (this.getValue()) );
   	this.setClassFromState();
   }

});


})();