/**
 * @class Basic string field (equivalent to the input type "text")
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 * options:<ul>
 *	  <li>regexp: regular expression used to validate (otherwise it always validate)</li>
 *   <li>size: size attribute of the input</li>
 *	  <li>numbersOnly: boolean, accept only numbers if true</li>
 * </ul>
 */
inputEx.StringField = function(options) {
   inputEx.StringField.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.StringField, inputEx.Field);
   
/**
 * Add the option "size"
 */
inputEx.StringField.prototype.setOptions = function() {
   inputEx.StringField.superclass.setOptions.call(this);
      
   // Field Size
   this.options.size = this.options.size || 20;
};
   
inputEx.StringField.prototype.renderComponent = function() {
   // Attributes of the input field
   var attributes = {};
   attributes.type = 'text';
   attributes.size = this.options.size;
   if(this.options.name) attributes.name = this.options.name;
   
   // Create the node
   this.el = inputEx.cn('input', attributes);
	
   // Append it to the main element
   this.divEl.appendChild(this.el);
};
	
inputEx.StringField.prototype.getEl = function() {
   return this.divEl;
};
	
	
inputEx.StringField.prototype.initEvents = function() {	
   // The "input" event doesn't exist in IE so we use the "keypress" with a setTimeout to wait until the new value has been set
   //YAHOO.util.Event.addListener(this.el, "input", this.onInput, this, true);
   var that = this;
   YAHOO.util.Event.addListener(this.el, "keypress", function(e) { setTimeout(function() { that.onInput(e); },50); });
	
	YAHOO.util.Event.addListener(this.el, "change", this.onChange, this, true);
	
	YAHOO.util.Event.addListener(this.el, "focus", this.onFocus, this, true);
	YAHOO.util.Event.addListener(this.el, "blur", this.onBlur, this, true);	   
};
		
inputEx.StringField.prototype.getValue = function() { 
	return this.el.value;
};
	
/**
 * Function to set the value
 * @param {String} value The new value
 */
inputEx.StringField.prototype.setValue = function(value) {
   this.el.value = value;
};	
	
/**
 * onInput is called 50ms after a "keypress" event
 */
inputEx.StringField.prototype.onInput = function(e) { 
   if(this.options.numbersOnly) {
	   this.setValue( this.getValue().replace(/[^0-9]/g,'') );
   }
	
   this.setClassFromState();
};

/**
 * Uses the optional regexp to validate the field value
 */
inputEx.StringField.prototype.validate = function() { 
   // if we are using a regular expression
   if( this.options.regexp ) {
	   return this.getValue().match(this.options.regexp);
   }
   return true;
};
	
	
/**
 * Disable the field
 */
inputEx.StringField.prototype.disable = function() {
   this.el.disabled = true;
};

/**
 * Enable the field
 */
inputEx.StringField.prototype.enable = function() {
   this.el.disabled = false;
};

/**
 * Set the focus to this field
 */
inputEx.StringField.prototype.focus = function() {
   if(!!this.el && YAHOO.lang.isFunction(this.el.focus) ) {
      this.el.focus();
   }
};

/**
 * Register this class as "string" type
 */
inputEx.registerType("string", inputEx.StringField);

