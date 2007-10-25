/** 
 * @fileoverview This files contains the 'Field' 
 * class of {@link http://inputEx.neyric.com inputEx}
 *
 * @dependencies YAHOO.util.Dom, YAHOO.util.Event
 *
 * @author Eric Abouaf eric.abouaf at centraliens.net
 * @version 0.1 
 */

// defines YAHOO.inputEx namespace
YAHOO.namespace('inputEx');

YAHOO.inputEx.messages = {
	required: "This field is required",
	invalid: "This field is invalid"
};

/**
 * @class YAHOO.inputEx.Field 
 * Create the dom and basic behaviour of a RUI field 
 *
 * options:
 *		- name (required): the name of the field
 *		- numbers: boolean
 *		- required: cannot be null and must validate
 *		- regexp: regular expression used to validate (otherwise it always validate)
 *		- noicon: this prevent the icon from being rendered (and the tooltip as well) (default to false)
 */
YAHOO.inputEx.Field = function(options) {
	
	// Save the options locally
	this.options = options;
	
	// Define default messages
	this.options.messages = this.options.messages || {};
	this.options.messages.required = this.options.messages.required || YAHOO.inputEx.messages.required;
	this.options.messages.invalid = this.options.messages.invalid || YAHOO.inputEx.messages.invalid;
	
	// Call the render of the dom
	this.render();
	
	// Set the initial value
	if(this.options.value) {
		this.setValue(this.options.value);
	}
	
	// initialize behaviour events
	this.initEvents();
	
	// set the default styling
	this.setClassFromState();
};


/**
 * Default render of the dom element
 */
YAHOO.inputEx.Field.prototype.render = function() {
	
	// Create a DIV element to wrap the editing el and the image
	this.divEl = document.createElement('DIV');
	
	this.el = document.createElement('INPUT');
	this.el.type = 'text';
   this.el.name = this.options.name;
   this.el.value = this.options.value || ''; // modif par MAX //////////////
	this.el.size = this.options.size || 20;
	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');
	this.divEl.appendChild(this.el);
	
	// Create a span next to the field with an icon and a tooltip
	if( !this.options.noicon ) {
		this.imgEl = document.createElement('SPAN');
		this.imgEl.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
		YAHOO.util.Dom.addClass(this.imgEl, 'inputEx-field-img');
	
   	this.tooltip = new YAHOO.widget.Tooltip('random'+this.options.name, { context: this.imgEl, text:"" }); 
		YAHOO.util.Dom.setStyle(this.tooltip.element, 'z-index', '999');
		
		this.divEl.appendChild(this.imgEl);
	}
	
};

/**
 * The default render creates a div to put in the messages
 */

YAHOO.inputEx.Field.prototype.getEl = function() {
	return this.divEl;
};


/**
 * Initialize events of the Input
 */
YAHOO.inputEx.Field.prototype.initEvents = function() {
	YAHOO.util.Event.addListener(this.el, "input", this.onInput, this, true);
	YAHOO.util.Event.addListener(this.el, "focus", this.onFocus, this, true);
	YAHOO.util.Event.addListener(this.el, "blur", this.onBlur, this, true);
};


/**
 * Return the value of the input
 */
YAHOO.inputEx.Field.prototype.getValue = function() {
	return this.el.value;
};

/**
 * Function to set the value
 */
YAHOO.inputEx.Field.prototype.setValue = function(val) {
	this.el.value = val;
};

/**
 * Set the styles for valid/invalide state
 */
YAHOO.inputEx.Field.prototype.setClassFromState = function() {
	
	if( this.previousState ) {
		YAHOO.util.Dom.removeClass(this.getEl(), 'inputEx-'+this.previousState );
	}
	this.previousState = this.getState();
	YAHOO.util.Dom.addClass(this.getEl(), 'inputEx-'+this.previousState );
	
	this.setToolTipMessage();
};

/**
 * Set the tooltip message
 */ 
YAHOO.inputEx.Field.prototype.setToolTipMessage = function() { 
	if(this.tooltip) {
		if( this.previousState == 'required') {
			this.tooltip.setBody('<img src="images/required.gif" /> '+this.options.messages.required);
		}
		else if( this.previousState == 'invalid') {
			this.tooltip.setBody('<img src="images/exclamation.gif" /> '+this.options.messages.invalid);
		}
	}
};  

YAHOO.inputEx.Field.prototype.onFocus = function(e) {
	YAHOO.util.Dom.addClass(this.getEl(), 'inputEx-focused');
};

YAHOO.inputEx.Field.prototype.onBlur = function(e) {
	YAHOO.util.Dom.removeClass(this.getEl(), 'inputEx-focused');
};

/**
 * @method getState
 * returns a string containing one of the following
 * states:
 */
YAHOO.inputEx.Field.stateEmpty = 'empty';
YAHOO.inputEx.Field.stateRequired = 'required';
YAHOO.inputEx.Field.stateValid = 'valid';
YAHOO.inputEx.Field.stateInvalid = 'invalid';
YAHOO.inputEx.Field.prototype.getState = function() { 
	
	// if the field is empty :
	if( this.getValue() === '' ) {
		if( this.options.required) { 
			return YAHOO.inputEx.Field.stateRequired; 
		}
		else { 
			return YAHOO.inputEx.Field.stateEmpty;  
		}
	}
	
	if( this.validate() ) {
		return YAHOO.inputEx.Field.stateValid;
	}
	else {
		return YAHOO.inputEx.Field.stateInvalid;
	}
};

/**
 * Validation of the field
 */
YAHOO.inputEx.Field.prototype.validate = function() { 
	// if we are using a regular expression
	if( this.options.regexp ) {
		return this.getValue().match(this.options.regexp);
	}
   return true;
};  

/**
 * onInput event handler
 */
YAHOO.inputEx.Field.prototype.onInput = function(e) { 
	if(this.options.numbers) {
		YAHOO.util.Event.stopEvent(e);
		this.setValue( (this.getValue()).replace(/[^0-9]/g,'') );
	}
	
	this.setClassFromState();
};  


/**
 * Close the field and eventually opened popups...
 */
YAHOO.inputEx.Field.prototype.close = function() {
   // Please override this function...
};

