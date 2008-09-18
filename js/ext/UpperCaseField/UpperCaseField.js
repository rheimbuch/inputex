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
      // don't always rewrite the value to able selections with Ctrl+A
      var uppered = val.toUpperCase();
      if(uppered != this.el.value) {
         this.el.value = uppered;
      }
   },

   /**
    * Call setvalue on input to update the field with upper case value
    * @param {Event} e The original 'input' event
    */
   onKeyPress: function(e) { 
   	inputEx.UpperCaseField.superclass.onKeyPress.call(this,e);
   	
   	// Re-Apply a toUpperCase method
   	YAHOO.lang.later(0,this,function() {this.setValue( (this.getValue()) );})
   }

});

/**
* Register this class as "uppercase" type
*/
inputEx.registerType("uppercase", inputEx.UpperCaseField);

})();