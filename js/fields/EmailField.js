/**
 * Field that adds the email regexp for validation. Result is always lower case.
 *
 * @class inputEx.EmailField
 * @extends inputsEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.EmailField = function(options) {
   inputEx.EmailField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.EmailField, inputEx.Field, {
   
   /**
    * Set the email regexp and invalid message
    */
   setOptions: function() {
      inputEx.EmailField.superclass.setOptions.call(this);
      this.options.messages.invalid = inputEx.messages.invalidEmail;
      this.options.regexp = inputEx.regexps.email;
   },
   
   /**
    * Set the value to lower case since email have no case
    */
   getValue: function() {
      return this.el.value.toLowerCase();
   }
   
});

// Specific message for the email field
inputEx.messages.invalidEmail = "Invalid email, ex: sample@test.com";


/**
 * Register this class as "email" type
 */
inputEx.registerType("email", inputEx.EmailField);
