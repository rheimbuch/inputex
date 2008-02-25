/** 
 * @fileoverview This files contains the inputEx.Field class
 */
/** 
 * Create the dom and basic behaviour of an inputEx field
 *
 * @class inputEx.Field 
 * @constructor
 * @param {Object} options Options object (see options property)
 */
inputEx.Field = function(options) {
	
	/**
	 * Options :
	 * <ul>
    *	  <li>name: the name of the field</li>
    *	  <li>numbersOnly: boolean, accept only numbers if true</li>
    *	  <li>required: boolean, cannot be null if true</li>
    *	  <li>regexp: regular expression used to validate (otherwise it always validate)</li>
    *	  <li>tooltipIcon: show an icon next to the field and display an error in a tooltip (default false)</li>
    *   <li>className: CSS class name for the div wrapper (default 'inputEx-Field')
    *   <li>size: size attribute of the input</li>
    *   <li>value: initial value</li>
    * </ul>
	 */
	this.options = options || {};
	
	// Set the default values of the options
	this.setOptions();
	
	// Call the render of the dom
	this.render();
	
	// Set the initial value
	if(this.options.value) {
		this.setValue(this.options.value);
	}
	
	/**
	 * YAHOO custom event "updated"
	 */
	this.updatedEvt = new YAHOO.util.CustomEvent('updated', this);
	//this.updatedEvt.subscribe(function(e, params) { var value = params[0]; console.log("updated",value); }, this, true);
	
	// initialize behaviour events
	this.initEvents();
	
	// set the default styling
	this.setClassFromState();
};

/**
 * Set the default values of the options
 */
inputEx.Field.prototype.setOptions = function() {
   
   // Define default messages
	this.options.messages = this.options.messages || {};
	this.options.messages.required = this.options.messages.required || inputEx.messages.required;
	this.options.messages.invalid = this.options.messages.invalid || inputEx.messages.invalid;
	this.options.messages.valid = this.options.messages.valid || inputEx.messages.valid;
	
	// Other options
	this.options.size = this.options.size || 20;
	this.options.className = this.options.className || 'inputEx-Field';
	this.options.required = this.options.required ? true : false;
	this.options.tooltipIcon = this.options.tooltipIcon ? true : false;
	
	// The following options are used later:
	// + this.options.name
	// + this.options.regexp
	// + this.options.numbersOnly
	// + this.options.value
	
};

/**
 * Default render of the dom element
 */
inputEx.Field.prototype.render = function() {
	
	// Create a DIV element to wrap the editing el and the image
	this.divEl = inputEx.cn('div', {className: this.options.className});
	
	// Render the component
	this.renderComponent();
	
	// Create a div next to the field with an icon and a tooltip
	if( this.options.tooltipIcon ) {
		this.tooltipIcon = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-Field-stateIcon'});
		if(!inputEx.tooltipCount) { inputEx.tooltipCount = 0; }
   	this.tooltip = new YAHOO.widget.Tooltip('inputEx-tooltip-'+(inputEx.tooltipCount++), { context: this.tooltipIcon, text:"" }); 
		this.divEl.appendChild(this.tooltipIcon);
	}
	
};

/**
 * Render the interface component
 */
inputEx.Field.prototype.renderComponent = function() {
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

/**
 * The default render creates a div to put in the messages
 * @return {DOMElement} divEl The main DIV wrapper
 */
inputEx.Field.prototype.getEl = function() {
	return this.divEl;
};

/**
 * Initialize events of the Input
 */
inputEx.Field.prototype.initEvents = function() {
	
	// The "input" event doesn't exist in IE so we use the "keypress" with a setTimeout to wait until the new value has been set
	//YAHOO.util.Event.addListener(this.el, "input", this.onInput, this, true);
	var that = this;
	YAHOO.util.Event.addListener(this.el, "keypress", function(e) { setTimeout(function() { that.onInput(e); },50); });
	
	YAHOO.util.Event.addListener(this.el, "change", this.onChange, this, true);
	
	YAHOO.util.Event.addListener(this.el, "focus", this.onFocus, this, true);
	YAHOO.util.Event.addListener(this.el, "blur", this.onBlur, this, true);
   
};

/**
 * Return the value of the input
 * @return {String} value of the field
 */
inputEx.Field.prototype.getValue = function() {
	return this.el.value;
};

/**
 * Function to set the value
 * @param {String} value The new value
 */
inputEx.Field.prototype.setValue = function(value) {
	this.el.value = value;
};

/**
 * Set the styles for valid/invalide state
 */
inputEx.Field.prototype.setClassFromState = function() {
	
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
inputEx.Field.prototype.setToolTipMessage = function() { 
	if(this.tooltip) {
	   var content = "";
		if( this.previousState == 'required') {
			content = '<div class="inputEx-tooltip-required"></div> <span>'+this.options.messages.required+'</span>';
		}
		else if( this.previousState == 'invalid') {
			content = '<div class="inputEx-tooltip-exclamation"></div> <span>'+this.options.messages.invalid+'</span>';
		}
   	else {
   		content = '<div class="inputEx-tooltip-validated"></div> <span>'+this.options.messages.valid+'</span>';
   	}
   	this.tooltip.setBody(content);
	}
};  

/**
 * Function called on the focus event
 */
inputEx.Field.prototype.onFocus = function(e) {
	YAHOO.util.Dom.addClass(this.getEl(), 'inputEx-focused');
};

/**
 * Function called on the blur event
 */
inputEx.Field.prototype.onBlur = function(e) {
	YAHOO.util.Dom.removeClass(this.getEl(), 'inputEx-focused');
};

/**
 * Returns the current state (given its value)
 * @return {String} One of the following states: 'empty', 'required', 'valid' or 'invalid'
 */
inputEx.Field.prototype.getState = function() { 
	// if the field is empty :
	if( this.getValue() === '' ) {
	   return this.options.required ? inputEx.stateRequired : inputEx.stateEmpty;
	}
	return this.validate() ? inputEx.stateValid : inputEx.stateInvalid;
};

/**
 * Validation of the field
 */
inputEx.Field.prototype.validate = function() { 
	// if we are using a regular expression
	if( this.options.regexp ) {
		return this.getValue().match(this.options.regexp);
	}
   return true;
};  

/**
 * onInput is called 50ms after a "keypress" event
 */
inputEx.Field.prototype.onInput = function(e) { 
	if(this.options.numbersOnly) {
		this.setValue( this.getValue().replace(/[^0-9]/g,'') );
	}
	
	this.setClassFromState();
};  

/**
 * onChange event handler
 */
inputEx.Field.prototype.onChange = function(e) {
	this.setClassFromState();
	
	// Fire the "updated" event (only if the field validated)
	if(this.validate()) {
	   // Uses setTimeout to escape the stack (that originiated in an event)
	   var that = this;
	   setTimeout(function() {
   	   that.updatedEvt.fire(that.getValue());
	   },50);
   }
};

/**
 * Close the field and eventually opened popups...
 */
inputEx.Field.prototype.close = function() {
   // Please override this function...
};

/**
 * Disable the field
 */
inputEx.Field.prototype.disable = function() {
   this.el.disabled = true;
};

/**
 * Enable the field
 */
inputEx.Field.prototype.enable = function() {
   this.el.disabled = false;
};

/**
 * Register this class as "string" type
 */
inputEx.registerType("string", inputEx.Field);

