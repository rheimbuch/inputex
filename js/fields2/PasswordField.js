/**
 * Create a password input
 *
 * @class inputEx.PasswordField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Same as parent class options
 */
inputEx.PasswordField = function(options) {
	inputEx.PasswordField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.PasswordField, inputEx.Field, {
   /**
    * Set the el type to 'password'
    */
   renderComponent: function() {
   	inputEx.PasswordField.superclass.renderComponent.call(this);
   	this.el.type = 'password';
   }
});


/**
 * Register this class as "password" type
 */
inputEx.registerType("password", inputEx.PasswordField);
