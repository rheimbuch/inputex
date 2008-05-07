/**
 * @class Create a password field. Options:
 * -minLength
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.PasswordField = function(options) {
	inputEx.PasswordField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.PasswordField, inputEx.StringField);


/**
 * Add the password regexp, and the minLength (+set messges)
 */
inputEx.PasswordField.prototype.setOptions = function() {
   
   inputEx.PasswordField.superclass.setOptions.call(this);
   
   this.options.regexp = inputEx.regexps.password;
   //   minLength || 5 not possible because 0 falsy value...
   this.options.minLength = (this.options.minLength == undefined) ? 5 : this.options.minLength;
	this.options.messages.invalid = inputEx.messages.invalidPassword[0]+this.options.minLength+inputEx.messages.invalidPassword[1];
};

/**
 * Set the el type to 'password'
 */
inputEx.PasswordField.prototype.renderComponent = function() {
   // IE doesn't want to set the "type" property to 'password' if the node has a parent
   // even if the parent is not in the DOM yet !!
      
	// Attributes of the input field
   var attributes = {};
   attributes.type = 'password';
   attributes.size = this.options.size;
   if(this.options.name) attributes.name = this.options.name;

   // Create the node
	this.el = inputEx.cn('input', attributes);

	// Append it to the main element
	this.divEl.appendChild(this.el);
};
   
/**
 * Set this field as the confirmation for the targeted password field:
 */
inputEx.PasswordField.prototype.setConfirmationField = function(passwordField) {
   this.options.confirmPasswordField = passwordField;
   this.options.messages.invalid = inputEx.messages.invalidPasswordConfirmation;
   this.options.confirmPasswordField.options.confirmationPasswordField = this;
};

/**
 * The validation adds the confirmation password field support
 */
inputEx.PasswordField.prototype.validate = function() {
   if(this.options.confirmPasswordField) {
      return (this.options.confirmPasswordField.getValue() == this.getValue());
   }
   else {
      var superValid = inputEx.PasswordField.superclass.validate.call(this);
      var lengthValid = this.getValue().length >= this.options.minLength;
      return superValid && lengthValid;
   }
};

/**
 * Update the state of the confirmation field
 */
inputEx.PasswordField.prototype.onInput = function(e) {
   inputEx.PasswordField.superclass.onInput.call(this,e);
   if(this.options.confirmationPasswordField) {
      this.options.confirmationPasswordField.setClassFromState();
   }
};

// Specific message for the password field
inputEx.messages.invalidPassword = ["The password schould contain at least "," numbers or caracters"];
inputEx.messages.invalidPasswordConfirmation = "Passwords are different !";

/**
 * Register this class as "password" type
 */
inputEx.registerType("password", inputEx.PasswordField);
