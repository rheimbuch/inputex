/** 
 * @fileoverview This files contains the 'Field' 
 * class of {@link http://inputEx.neyric.com inputEx}
 *
 * @dependencies YAHOO.util.Dom, YAHOO.util.Event
 *
 * @author Eric Abouaf eric.abouaf at centraliens.net
 * @version 0.1 
 */

// defines inputEx namespace
YAHOO.namespace('inputEx');

inputEx.messages = {
	required: "This field is required",
	invalid: "This field is invalid",
	valid: "This field is valid"
};

/**
 * @class inputEx.Field 
 * Create the dom and basic behaviour of a RUI field 
 *
 * options:
 *		- name (required): the name of the field
 *		- numbers: boolean
 *		- required: cannot be null and must validate
 *		- regexp: regular expression used to validate (otherwise it always validate)
 *		- noicon: this prevent the icon from being rendered (and the tooltip as well) (default to false)
 */
inputEx.Field = function(options) {
	
	// Save the options locally
	this.options = options;
	
	// Define default messages
	this.options.messages = this.options.messages || {};
	this.options.messages.required = this.options.messages.required || inputEx.messages.required;
	this.options.messages.invalid = this.options.messages.invalid || inputEx.messages.invalid;
	this.options.messages.valid = this.options.messages.valid || inputEx.messages.valid;
	
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
inputEx.Field.prototype.render = function() {
	
	// Create a DIV element to wrap the editing el and the image
	this.divEl = document.createElement('DIV');
	
	this.el = document.createElement('INPUT');
	this.el.type = 'text';
   this.el.name = this.options.name;
   this.el.value = this.options.value || ''; // modif par MAX //////////////
	this.el.size = this.options.size || 20;
	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');
	this.divEl.appendChild(this.el);
	
	// Create a div next to the field with an icon and a tooltip
	if( !this.options.noicon ) {
		this.imgEl = document.createElement('div');
		this.imgEl.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
		YAHOO.util.Dom.addClass(this.imgEl, 'inputEx-field-img');
	
	   // TODO: random number
   	this.tooltip = new YAHOO.widget.Tooltip('random'+this.options.name, { context: this.imgEl, text:"" }); 
		YAHOO.util.Dom.setStyle(this.tooltip.element, 'z-index', '999');
		
		this.divEl.appendChild(this.imgEl);
	}
	
};

/**
 * The default render creates a div to put in the messages
 */

inputEx.Field.prototype.getEl = function() {
	return this.divEl;
};


/**
 * Initialize events of the Input
 */
inputEx.Field.prototype.initEvents = function() {
	YAHOO.util.Event.addListener(this.el, "input", this.onInput, this, true);
	YAHOO.util.Event.addListener(this.el, "focus", this.onFocus, this, true);
	YAHOO.util.Event.addListener(this.el, "blur", this.onBlur, this, true);
};


/**
 * Return the value of the input
 */
inputEx.Field.prototype.getValue = function() {
	return this.el.value;
};

/**
 * Function to set the value
 */
inputEx.Field.prototype.setValue = function(val) {
	this.el.value = val;
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

inputEx.Field.prototype.onFocus = function(e) {
	YAHOO.util.Dom.addClass(this.getEl(), 'inputEx-focused');
};

inputEx.Field.prototype.onBlur = function(e) {
	YAHOO.util.Dom.removeClass(this.getEl(), 'inputEx-focused');
};

/**
 * @method getState
 * returns a string containing one of the following
 * states:
 */
inputEx.Field.stateEmpty = 'empty';
inputEx.Field.stateRequired = 'required';
inputEx.Field.stateValid = 'valid';
inputEx.Field.stateInvalid = 'invalid';
inputEx.Field.prototype.getState = function() { 
	
	// if the field is empty :
	if( this.getValue() === '' ) {
		if( this.options.required) { 
			return inputEx.Field.stateRequired; 
		}
		else { 
			return inputEx.Field.stateEmpty;  
		}
	}
	
	if( this.validate() ) {
		return inputEx.Field.stateValid;
	}
	else {
		return inputEx.Field.stateInvalid;
	}
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
 * onInput event handler
 */
inputEx.Field.prototype.onInput = function(e) { 
	if(this.options.numbers) {
		YAHOO.util.Event.stopEvent(e);
		this.setValue( (this.getValue()).replace(/[^0-9]/g,'') );
	}
	
	this.setClassFromState();
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

﻿/** 
 * @fileoverview This files contains the 'Form' 
 * class of {@link http://inputEx.neyric.com inputEx}
 *
 * @dependencies YAHOO.util.Dom, YAHOO.util.YAHOO.util.Event
 *
 * @author Eric Abouaf eric.abouaf at centraliens.net
 * @version 0.1 
 */

/**
 * @class Provide a generative method to build a dom form
 * with some user-interaction features.
 *
 * options:
 * 	- className: css class name
 *		- formName: 'name' attribute of the form
 * 	- label: form title text
 *		- inputs: list of Inputs like:
 *			{label: "Phone", name: "phone", type: inputEx.Field, numbers: true, required: true},
 *			(See each params for each field)
 *		- buttons: list of buttons like:
 *			{value: "Valider", type: "submit"}
 */
inputEx.Form = function(options) {

  // Save the options locally
  this.options = options || {};

  // Render the dom
  this.render();
		
  // Styling, default className is 'inputEx'
  YAHOO.util.Dom.addClass(this.form, this.options.className || 'inputExForm');
		
  // Subscribe to events
  YAHOO.util.Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
};

/**
 * @method onSubmitForm
 * Intercept the 'onsubmit' event and stop it if !validate
 */
inputEx.Form.prototype.onSubmit = function(e) {
	if ( !this.validate() ) {
		YAHOO.util.Event.stopEvent(e);
	} 
};

/**
 * @method validate
 * Return true if all the fields validates
 */
inputEx.Form.prototype.validate = function() {
	
	// Validate all the sub fields
	for (var i = 0 ; i < this.inputs.length ; i++) {
		var input = this.inputs[i];
		var state = input.getState();
		if( state == inputEx.Field.stateRequired || state == inputEx.Field.stateInvalid ) {
			return false;
		}
   }
	return true;
};
	
/**
 * @method getEl
 * Returns the form element
 */
inputEx.Form.prototype.getEl = function() {
   return this.form;
};

/**
 * @method getValue
 * Returns a javascript object of the name/value pairs
 */
inputEx.Form.prototype.getValue = function() {
	var o = {};
	for (var i = 0 ; i < this.inputs.length ; i++) {
		o[this.inputs[i].options.name] = this.inputs[i].getValue();
   }
	return o;
};

/**
 *  @methode enable
 *  Enable/Disable all fields in the form
 */
inputEx.Form.prototype.enable = function(enable) {
   var disabled = !enable;
 	for (var i = 0 ; i < this.inputs.length ; i++) {
 	   var el = this.inputs[i].getEl();
 		el.disabled = disabled;
   }
};

/**
 * @method setValue
 * @param oValues object literal with the values
 */
inputEx.Form.prototype.setValue = function(oValues) { 
	for (var i = 0 ; i < this.inputs.length ; i++) {
		this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
		this.inputs[i].setClassFromState();
   }
};

/**
 * @method render
 * generates the dom of the form
 */
inputEx.Form.prototype.render = function() {
		
	// Create the YAHOO.util.Dom tree
	this.form = document.createElement('FORM');
	
	// Set the autocomplete attribute to off to disable firefox autocompletion
	this.form.setAttribute('autocomplete','off');
	
	var fieldset = document.createElement('FIELDSET');
	var table = document.createElement('TABLE');
	this.tbody = document.createElement('TBODY');
		
	// Set the name of the form
	if(this.options.formName) { this.form.name = this.options.formName; }
	
	// Set the method and action
	this.form.method = this.options.method || 'POST';
	this.form.action = this.options.action || '';
		
	// Adds input fields and buttons
	this.renderInputFields();
	this.renderButtons();
		
	// Append everything to the form element
	table.appendChild(this.tbody);
	
	// Set the label of the fieldset
	if( this.options.label ) {
		var legend = document.createElement('LEGEND');
		legend.innerHTML = this.options.label;
		fieldset.appendChild(legend);
	}
	
	fieldset.appendChild(table);
	this.form.appendChild(fieldset);
};

/**
 *
 */
inputEx.Form.prototype.renderLabel = function(inputConfig, tdLabel) {
   if (inputConfig.label) {
		tdLabel.innerHTML = input.label;
	}
};

/**
 * @method renderInputFields
 * builds input fields
 */
inputEx.Form.prototype.renderInputFields = function() {
	var input,tr,tdLabel,tdInput;
	
	// Array that will contain the references to the created Fields
	this.inputs = [];
		
	// Iterate this.createInput on input fields
	for (var i = 0 ; i < this.options.inputs.length ; i++) {
		input = this.options.inputs[i];
		tr = document.createElement('TR');
				
		tdLabel = document.createElement('TD');
		this.renderLabel(input, tdLabel);
		
		tdInput = document.createElement('TD');

		// Create the new field with the given type as class
		if( !input.type ) input.type = inputEx.Field;
      
      // Mask hidden fields
		if(input.type == inputEx.HiddenField) {
         YAHOO.util.Dom.addClass(tr,'inputExForm-hiddenLine');
      };
		
		var inputParams = {};
		for( var field in input.inputParams ) {
		   if( input.inputParams.hasOwnProperty(field) ) {
		      inputParams[field] = input.inputParams[field];
		   }
		}
		if(input.group) { inputParams.name += '[0]'; }
		this.inputs[i] = new input.type(inputParams);
		tdInput.appendChild( this.inputs[i].getEl() );
			
		YAHOO.util.Dom.addClass(tdLabel, 'inputExForm-label');
			
		tr.appendChild(tdLabel);
		tr.appendChild(tdInput);
		this.tbody.appendChild(tr);
		
		// Sort input fields by groups
		if(input.group) {
		   if(!this._groups) { 
		      this._groups = []; 
   		   this._groupDubNbr = []; // Keep the number for [0]
		   }
		   if( !this._groups[input.group] ) {
		      this._groups[input.group] = [input];
		      this._groupDubNbr[input.group] = 1;
		   }
		   else {
		      this._groups[input.group].push(input);
		   }
		}
		
	}
	
	// Add a button to duplicate a group
	if(this._groups) {
	   for(var groupName in this._groups) {
	      if( this._groups.hasOwnProperty(groupName) ) {
      		tr = document.createElement('TR');
		      tdLabel = document.createElement('TD');
      		tdInput = document.createElement('TD');
      		var button = document.createElement('input');
      		button.type = "button";
      		button.value = "+";
      		YAHOO.util.Event.addListener(button, 'click', this.addGroupEntries, this, true);
      		tdInput.appendChild(button);
   		   tr.appendChild(tdLabel);
   		   tr.appendChild(tdInput);
   		   this.tbody.appendChild(tr);
	      }
	   }
	}
		
};



/**
 * @method addGroupEntries
 * add a new instance of each input field in groupName
 */
inputEx.Form.prototype.addGroupEntries = function() {
   
   var groupName = "fields";
   
   var form = this;
   for( var j = 0 ; j < form._groups[groupName].length ; j++) {
      
		var inputParams = {};
		for( var field in form._groups[groupName][j].inputParams ) {
		   if( form._groups[groupName][j].inputParams.hasOwnProperty(field) ) {
		      inputParams[field] = form._groups[groupName][j].inputParams[field];
		   }
		}
		inputParams.name += '['+this._groupDubNbr[groupName]+']';
		
	   var input = new form._groups[groupName][j].type(inputParams);
	   form.inputs.push(input);
	   var tr = document.createElement('TR');
		var tdLabel = document.createElement('TD');
		if (form._groups[groupName][j].label) {
			tdLabel.innerHTML = form._groups[groupName][j].label;
		}
		var tdInput = document.createElement('TD');
		tdInput.appendChild( input.getEl() );
	   tr.appendChild(tdLabel);
	   tr.appendChild(tdInput);
	   this.tbody.insertBefore(tr,this.tbody.childNodes[this.tbody.childNodes.length-2] );
   }
   
   this._groupDubNbr[groupName] += 1;
};


	
/**
 * @method renderButtons
 * Render the buttons dom
 */
inputEx.Form.prototype.renderButtons = function() {
	var tr = document.createElement('TR');
	var tdLabel = document.createElement('TD');
	var tdButtons = document.createElement('TD');
		
	var button, buttonEl;
	if(this.options.buttons) {
		for(var i = 0 ; i < this.options.buttons.length ; i++ ) {
			button = this.options.buttons[i];
			buttonEl = document.createElement('INPUT');
			buttonEl.type = button.type;
			buttonEl.value = button.value;
			if( button.onClick ) { buttonEl.onclick = button.onClick; }
			tdButtons.appendChild(buttonEl);
		}
	}
		
	tr.appendChild(tdLabel);
	tr.appendChild(tdButtons);
	this.tbody.appendChild(tr);
};
	

/**
 * @method close
 * Calls close on each field
 */
inputEx.Form.prototype.close = function() {
	for (var i = 0 ; i < this.inputs.length ; i++) {
		this.inputs[i].close();
   }
};

/**
 * @class inputEx.UpperCaseField
 * Create a field where the value is always uppercase
 */
inputEx.UpperCaseField = function(options) {
   inputEx.UpperCaseField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UpperCaseField, inputEx.Field);

inputEx.UpperCaseField.prototype.onInput = function(e) { 
	this.setValue( (this.getValue()).toUpperCase() );
	this.setClassFromState();
};



/**
 * @class inputEx.UneditableHtmlField
 * Create a uneditable field where you can stick the html you want
 */
inputEx.UneditableHtmlField = function(options) {
	inputEx.UneditableHtmlField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UneditableHtmlField, inputEx.Field);

inputEx.UneditableHtmlField.prototype.render = function() {
   this.divEl = document.createElement('DIV');
};

inputEx.UneditableHtmlField.prototype.setValue = function(val) {
   this.value = val;
   if(this.options.formatValue) {
      this.divEl.innerHTML = this.options.formatValue(val);
   }
   else if(this.options.formatDom) {
      var r = this.options.formatDom(val);
      this.divEl.innerHTML = "";
      if(r) this.divEl.appendChild(r);
   }
   else {
      this.divEl.innerHTML = val;
   }
};

inputEx.UneditableHtmlField.prototype.getValue = function() {
   return this.value;
};



/**
 * @class inputEx.SelectField
 * Create a <select> input, inherits from inputEx.Field
 *
 * options:
 *		- selectValues: contains the list of <options> values
 */
inputEx.SelectField = function(options) {
	inputEx.SelectField.superclass.constructor.call(this,options);
  };
YAHOO.lang.extend(inputEx.SelectField, inputEx.Field);

inputEx.SelectField.prototype.render = function() {
   this.divEl = document.createElement('DIV');
   this.el = document.createElement('SELECT');
   this.el.name = this.options.name || '';
   if (this.options.multiple) {this.el.multiple = true; this.el.size = this.options.selectValues.length;}
   this.optionEls = [];
   for( var i = 0 ; i < this.options.selectValues.length ; i++) {
      this.optionEls[i] = document.createElement('OPTION');
      this.optionEls[i].value = this.options.selectValues[i];
      this.optionEls[i].innerHTML = (this.options.selectOptions) ? this.options.selectOptions[i] : this.options.selectValues[i];
      this.el.appendChild(this.optionEls[i]);
   }
   this.divEl.appendChild(this.el);
};

inputEx.SelectField.prototype.setValue = function(val) {
   var index = 0;
   var option;
   for(var i = 0 ; i < this.options.selectValues.length ; i++) {
      if(val === this.options.selectValues[i]) {
         option = this.el.childNodes[i];
		 option.selected = "selected";
      }
   }
};

/**
 * @class inputEx.checkBox
 * Create a <checkbox> input, inherits from inputEx.Field
 *
 * options:
 *		- checked: true or false
 *		- sentValues: contains a list of two strings to be returned if checked or unchecked (ex: sentValues:['Returned_if_checked','Returned_if_unchecked'])
 */
inputEx.checkBox = function(options) {
	inputEx.checkBox.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.checkBox, inputEx.Field);

inputEx.checkBox.prototype.render = function() {
  
  this.sentValues = this.options.sentValues || ['Y','N'];
  this.checkedValue = this.sentValues[0];
  this.uncheckedValue = this.sentValues[1];

  this.divEl = document.createElement('DIV');

  this.el = document.createElement('INPUT');
  this.el.type = 'checkbox';
  this.el.checked = (this.options.checked === false) ? false : true;
  this.divEl.appendChild(this.el);
  
  this.label = document.createElement('label');
  this.label.innerHTML = this.options.label || '';
  YAHOO.util.Dom.addClass(this.label, 'inputExForm-checkbox-rightLabel');
  this.divEl.appendChild(this.label);
  
  // Keep state of checkbox in a hidden field (format : this.checkedValue or this.uncheckedValue)
  this.hiddenEl = document.createElement('INPUT');
  this.hiddenEl.type = 'hidden';
  this.hiddenEl.name = this.options.name || '';
  this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
  this.divEl.appendChild(this.hiddenEl);

  YAHOO.util.Event.addListener(this.el, "change", this.toggleHiddenEl, this, true);	
};

inputEx.checkBox.prototype.toggleHiddenEl = function() {
   this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
};

inputEx.checkBox.prototype.getValue = function() {
   return this.el.checked ? this.checkedValue : this.uncheckedValue;
};

/**
 * Function to set the value
 */
inputEx.checkBox.prototype.setValue = function(val) {
    if (val===this.checkedValue) {
		this.hiddenEl.value = val;
		this.el.checked = true;
	}
    else if (val===this.uncheckedValue) {
		this.hiddenEl.value = val;
		this.el.checked = false;
	}
	else {
	    throw "Wrong value assignment in checkBox input";
	}
};



/**
 * @class inputEx.Textarea
 * Create a <select> input, inherits from inputEx.Field
 *
 * options:
 *		- selectValues: contains the list of <options> values
 */
inputEx.Textarea = function(options) {
	inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.Textarea, inputEx.Field);

inputEx.Textarea.prototype.render = function() {
	this.divEl = document.createElement('DIV');
	this.el = document.createElement('TEXTAREA');
	this.el.value = this.options.value || '';
	this.el.rows = this.options.rows || 6;
	this.el.cols = this.options.cols || 23;
	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');
	this.divEl.appendChild(this.el);
};


/**
 * @class inputEx.HiddenField
 * Create a hidden input, inherits from inputEx.Field
 */
inputEx.HiddenField = function(options) {
	inputEx.HiddenField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.HiddenField, inputEx.Field);

inputEx.HiddenField.prototype.render = function() {
   this.type = inputEx.HiddenField;
	this.divEl = document.createElement('DIV');
	
	this.el = document.createElement('INPUT');
	this.el.type = 'hidden';
  this.el.name = this.options.name || '';

	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');
	
	this.divEl.appendChild(this.el);
};


/**
 * @class inputEx.PasswordField
 * Create a password input, inherits from inputEx.Field
 */
inputEx.PasswordField = function(options) {
	inputEx.PasswordField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.PasswordField, inputEx.Field);

inputEx.PasswordField.prototype.render = function() {
	inputEx.PasswordField.superclass.render.call(this);
	this.el.type = 'password';
};

	
/**
 * @class inputEx.EmailField
 * Adds an email regexp, inherits from inputEx.Field
 */
inputEx.messages.invalidEmail = "Invalid email, ex: sample@test.com";

inputEx.EmailField = function(options) {
	options.messages = options.messages || {};
	options.messages.invalid = inputEx.messages.invalidEmail;
	options.regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	inputEx.EmailField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.EmailField, inputEx.Field);

/*inputEx.EmailField.prototype.render = function() {
	inputEx.EmailField.superclass.render.call(this);
	this.el.size = 27;
};*/

inputEx.EmailField.prototype.getValue = function() {
	return this.el.value.toLowerCase();
};

/**
 * @class inputEx.IpadressField
 * Adds an IPv4 adress regexp, inherits from inputEx.Field
 */
inputEx.IpadressField = function(options) {
	options.regexp = /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/;
	inputEx.IpadressField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IpadressField, inputEx.Field);


/**
 * @class inputEx.FormattedField
 * Uses a format, inherits from inputEx.Field
 * This is used for numbers only.
 *
 * options:
 *		- format: format (zipcode: '#####', date: '##/##/####' )
 */
// Adds the numbers only option
inputEx.FormattedField = function(options) {
	inputEx.FormattedField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FormattedField, inputEx.Field);

inputEx.FormattedField.prototype.validate = function() { 
	return !this.getFormattedValue().match('_');
};

// Alias for getValue() here, but to getValue will be overriden in Datefield (where formatted value like 10/04/2003 and value is a datetime like 2003-10-4 00:00:00).
inputEx.FormattedField.prototype.getFormattedValue = function() {
	return this.el.value;
};

inputEx.FormattedField.prototype.onInput = function(e) {
	
	var value = this.getFormattedValue();
	
	var v = value.split('');
	var f = this.options.format.split('');
	
	var resultString = '';
	var matching = true;
	var lastMatchedPos = 0;
	for(var i = 0 ; i < f.length ; i++) {
		
		// Check if this char is matching
		if( matching && (	(v.length <= i ) ||
			 					(f[i] == '#' && ("0123456789").indexOf(v[i]) == -1) ||
			 					(f[i] != '#' && f[i] != v[i]) ) ) {
				matching = false;
		}
		
		if( matching ) {
			resultString += v[i];
			// autocomplete
			if ( i+1 < f.length && f[i+1] != '#') {
				resultString += f[i+1];
				i++;
			}
			lastMatchedPos = i+1;
		}
		else {
			resultString += f[i].replace('#','_');
		}
	}
	//this.setValue(resultString);
	this.el.value = resultString;
	this.el.selectionStart = lastMatchedPos;
   this.el.selectionEnd = lastMatchedPos;
	
	this.setClassFromState();
};

inputEx.FormattedField.prototype.initEvents = function() {
	inputEx.FormattedField.superclass.initEvents.call(this);
	YAHOO.util.Event.addListener(this.el, 'keydown', this.onKeyDown, this, true);
};

inputEx.FormattedField.prototype.onKeyDown = function(e) {
	if(e.keyCode == 8) {
		if( this.el.selectionStart == this.el.selectionEnd ) {
			var v = (this.getFormattedValue()).split('');
			if( ("0123456789").indexOf(v[this.el.selectionStart-1]) == -1 ) {
				//this.setValue((this.getFormattedValue()).substr(0,this.el.selectionStart-1) );
            this.el.value = (this.getFormattedValue()).substr(0,this.el.selectionStart-1);
			}
		}
	}
};

inputEx.FormattedField.prototype.onBlur = function(e) {
	inputEx.FormattedField.superclass.onBlur.call(this,e);

	if( this.getFormattedValue() == this.options.format.replace(/#/g,'_') ) {
		//this.setValue('');
      this.el.value = '';
	}

	this.setClassFromState();
};

/**
 * @class inputEx.DateField
 *
 * options: 
 *		- dateFormat: default to 'm/d/Y'
 */
inputEx.DateField = function(options) {
	options.format = '##/##/####';
	options.dateFormat = options.dateFormat || 'm/d/Y';
	inputEx.DateField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.DateField, inputEx.FormattedField);

inputEx.DateField.prototype.validate = function () {
	
	var value = this.el.value;
	if( value.match('_') ) { return false; }
   if (value === "") { return false; }
   var ladate = value.split("/");
   if ((ladate.length != 3) || isNaN(parseInt(ladate[0])) || isNaN(parseInt(ladate[1])) || isNaN(parseInt(ladate[2]))) { return false; }
	 var formatSplit = this.options.dateFormat.split('/');
	 var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
	 var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
	 var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   var unedate = new Date(Y,m,d);
   var annee = unedate.getFullYear();
   return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
};

inputEx.DateField.prototype.render = function() {
	inputEx.DateField.superclass.render.call(this);
	this.el.size = 10;
};

// Return value in DATETIME format (use getFormattedValue() to have 04/10/2002-like format)
inputEx.DateField.prototype.getValue = function() {
   // Hack to validate if field not required and empty
   if (this.el.value === '') { return '';}
   var ladate = this.getFormattedValue().split("/");
   var formatSplit = this.options.dateFormat.split('/');
   var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
   var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
   var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   return (new Date(Y,m,d));
};

inputEx.DateField.prototype.setValue = function(val) {
   
   // Don't try to parse a date if there is no date
   if( val === '' ) {
      this.el.value = '';
      return;
   }
   
  // DATETIME
	if (val instanceof Date) {
     str = this.options.dateFormat.replace('Y',val.getFullYear());
     str = str.replace('m',val.GetMonthNumberString());
     str = str.replace('d',val.GetDateString());
  } 
  // else date must match this.options.dateFormat
  else {
     str = val;
  }
		
	this.el.value = str;
};

/**
 * inputEx.ColorField
 *
 * @classDescription    Create a ColorPicker input field
 * @inherits            inputEx.Field
 * @param {Object}      same as parent options
 * @constructor
 */
inputEx.messages.selectColor = "Select a color :";
inputEx.ColorField = function(options) {
	inputEx.ColorField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.ColorField, inputEx.Field);

/**
 * Create a box that opens a Overlay when clicked
 *
 * @method  render
 * @memberOf         inputEx.ColorField
 */
inputEx.ColorField.prototype.render = function() {

	// Create a DIV element to wrap the editing el and the image
	this.divEl = document.createElement('DIV');

	// A hidden input field to store the color code 
	this.el = document.createElement('INPUT');
	this.el.type = 'hidden';
	this.el.name = this.options.name;
	this.el.value = this.options.value || '#DD7870';
	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');

	// Create a colored area
	this.colorEl = document.createElement('DIV');
	YAHOO.util.Dom.addClass(this.colorEl, 'inputEx-field-color');
	YAHOO.util.Dom.setStyle(this.colorEl, 'background-color', this.el.value);

	// Render the popup
	this.renderPopUp();

	// Elements are bound to divEl
	this.divEl.appendChild(this.el);
	this.divEl.appendChild(this.colorEl);
};

// This create a popup and add an colorGrid
inputEx.ColorField.prototype.renderPopUp = function() {
	
  // display or not the title
  this.displayTitle = this.options.displayTitle || false;
  
	// set default color grid  to be used
	var defaultGrid = this.options.auto || 1;
	
	// set colors available
	this.colors = this.options.colors || this.setDefaultColors(defaultGrid);
	this.length = this.colors.length;
	
	// set PopUp size ratio (default 16/9 ratio)
	this.ratio = this.options.ratio || [16,9];
	
	// set color grid dimensions
	this.squaresPerLine = Math.ceil(Math.sqrt(this.length*this.ratio[0]/this.ratio[1]));
	this.squaresPerColumn = Math.ceil(this.length/this.squaresPerLine);
	this.squaresOnLastLine = this.squaresPerLine - (this.squaresPerLine*this.squaresPerColumn-this.length);
	
	// set popup width
	var width = 30*this.squaresPerLine+10;
	
	// keep the visible state of the popup
	this.visible = false;
	
	// create the popup
	this.colorPopUp = document.createElement('div');
   YAHOO.util.Dom.setStyle(this.colorPopUp, "width", width+'px');
   YAHOO.util.Dom.setStyle(this.colorPopUp, "display", 'none');
	YAHOO.util.Dom.addClass(this.colorPopUp, 'inputEx-color-popup');
	
	// create the title
	if (this.displayTitle) {
      var div = document.createElement('div');
      div.innerHTML = inputEx.messages.selectColor;
      this.colorPopUp.appendChild( div );
   }

   var body = document.createElement('div');
   body.appendChild( this.renderColorGrid() );
   this.colorPopUp.appendChild(body);
   
   this.divEl.appendChild(this.colorPopUp);
};

/**
 * Add listeners for click and blur events
 *
 * @method           initEvents
 * @memberOf         inputEx.ColorField
 */
inputEx.ColorField.prototype.initEvents = function() {
	YAHOO.util.Event.addListener(this.colorEl, "click", this.toggleColorPopUp, this, true);
	YAHOO.util.Event.addListener(this.colorEl, "blur", this.closeColorPopUp, this, true);
};

inputEx.ColorField.prototype.toggleColorPopUp = function() {
	if( this.visible ) {	this.colorPopUp.style.display = 'none'; /*this.colorPopUp.hide(); */}
	else { this.colorPopUp.style.display = 'block'; /*this.colorPopUp.show(); */}
	this.visible = !this.visible;
};

inputEx.ColorField.prototype.close = function() {
   this.closeColorPopUp();
};

inputEx.ColorField.prototype.closeColorPopUp = function() {
	this.colorPopUp.style.display = 'none'; /*this.colorPopUp.hide(); */
	this.visible = false;
};

/**
 * This creates a color grid
 */ 
inputEx.ColorField.prototype.renderColorGrid = function() {
	
	var table = document.createElement('TABLE');
	var tbody = document.createElement('TBODY');
	var square, line, spacer;
	for(var i = 0; i<this.squaresPerColumn; i++) {
		line = document.createElement('TR');
		for(var j = 0; j<this.squaresPerLine; j++) {
			// spacer cells
			spacer = document.createElement('TD');
			YAHOO.util.Dom.setStyle(spacer, 'background-color', '#fff');
			YAHOO.util.Dom.setStyle(spacer, 'line-height', '10px');
			YAHOO.util.Dom.setStyle(spacer, 'cursor', 'default');
			spacer.innerHTML = '&nbsp;';
			line.appendChild(spacer);

			// fill remaining space with empty and inactive squares
		    if (i===(this.squaresPerColumn-1) && j>=this.squaresOnLastLine ) {
				square = document.createElement('TD');
				YAHOO.util.Dom.setStyle(square, 'background-color', '#fff');
				YAHOO.util.Dom.setStyle(square, 'line-height', '10px');
				YAHOO.util.Dom.setStyle(square, 'cursor', 'default');
				square.innerHTML = '&nbsp;&nbsp;&nbsp;';
				line.appendChild(square);
			// create active squares
			} else {
				square = document.createElement('TD');
				YAHOO.util.Dom.setStyle(square, 'background-color', '#'+this.colors[i*this.squaresPerLine+j]);
				YAHOO.util.Dom.setStyle(square, 'line-height', '10px');
				YAHOO.util.Dom.setStyle(square, 'cursor', 'pointer');
				square.innerHTML = '&nbsp;&nbsp;&nbsp;';
				YAHOO.util.Event.addListener(square, "click", this.onColorClick, this, true );
				line.appendChild(square);
			}
		}
		tbody.appendChild(line);
		
		// spacer line
		spacer = document.createElement('TR');
		YAHOO.util.Dom.setStyle(spacer, 'height', '8px');
		tbody.appendChild(spacer);
	}
	table.appendChild(tbody);

	return table;
};

inputEx.ColorField.prototype.onColorClick = function(e) {
	var square = e.target;
	var couleur = YAHOO.util.Dom.getStyle(square,'background-color'); 
	YAHOO.util.Dom.setStyle(this.colorEl,'background-color',couleur);
	
	// set hidden field value
	// Convertit une chaine du style "rgb(255,142,0)" en hexadecimal du style "#FF8E00"
  	var hexa = function (rgbcolor) {
	 // Convertit un entier en hexa
	 var DecToHex = function (n){
     var tblCode = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E","F");
     var BASE=16;
     var Num = parseInt(n, 10);
     var i;
     var strHex = "";
     if (! isNaN(Num)){
	    if(Num == '') return "00"; 
       while (Num>0){
          i=0;
          while(Num/Math.pow(BASE, i++)>=BASE);
          strHex += tblCode[Math.floor(Num/Math.pow(BASE, i-1))];
          if (Num%BASE==0) strHex+="0";
          Num = (Num % Math.pow(BASE, i-1));
       }
	    if(strHex.length == 1) {return '0'+strHex;}
       return strHex;
     }
     else return 0;
   };

	var rgb = rgbcolor.split(/([(,)])/);
	return '#'+DecToHex(rgb[2])+DecToHex(rgb[4])+DecToHex(rgb[6]);
  };
	this.el.value = hexa(couleur);
	
	// Overlay closure
	this.visible = !this.visible;
	this.colorPopUp.style.display = 'none'; /*this.colorPopUp.hide(); */
};

inputEx.ColorField.prototype.setDefaultColors = function(index) {
	var selections = [];
	// Interventions
	selections[0] = ["FFEA99","FFFF66","FFCC99","FFCAB2","FF99AD","FFD6FF","FF6666","E8EEF7","ADC2FF","ADADFF","CCFFFF","D6EAAD","B5EDBC","CCFF99"]; //["FF0000","FF2222","FF3333","FF4444","FF5555","FF6666","FF7777","FF8888","FF9999","FFAAAA"];
	//Evenements
	selections[1] = ["55AAFF","FFAAFF","FF7FAA","FF0202","FFD42A","F9F93B","DF8181","FEE3E2","D47FFF","2AD4FF","2AFFFF","AAFFD4"];
	// Extjs colorPalette
	selections[2] = ["000000","993300","333300","003300","003366","000080","333399","333333","800000","FF6600","808000","008000","008080","0000FF","666699","808080","FF0000","FF9900","99CC00","339966","33CCCC","3366FF","800080","969696","FF00FF","FFCC00","FFFF00","00FF00","00FFFF","00CCFF","993366","C0C0C0","FF99CC","FFCC99","FFFF99","CCFFCC","CCFFFF","99CCFF","CC99FF","F0F0F0"];
	
	return selections[index-1];
};

inputEx.ColorField.prototype.setValue = function(val) {
   this.el.value = val;
   YAHOO.util.Dom.setStyle(this.colorEl, 'background-color', this.el.value);
};

   /**
 * Quelques champs étendus inputEx
 * en francais !
 */

// Definition des messages en francais
inputEx.messages = {
	required: "Ce champ est obligatoire",
	invalid: "Ce champ n'est pas valide",
	valid: "Ce champ est valide",
	invalidEmail: "Email non valide, ex: michel.dupont@fai.fr",
	selectColor: "S&eacute;lectionnez une couleur :"
};

/**
 * @class inputEx.FrenchPhone
 */
inputEx.FrenchPhone = function(options) {
	options.format = '## ## ## ## ##';
	options.messages = {invalid: "Numéro non valide."};
	inputEx.FrenchPhone.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FrenchPhone, inputEx.FormattedField);

inputEx.FrenchPhone.prototype.validate = function () {
	var value = this.getValue();
	if( value.match('_') ) { return false; }
	if( value.substr(0,1) != '0' ) { return false; }
	return true;
};

/**
 * @class inputEx.FrenchDate
 */
inputEx.FrenchDate = function(options) {
	options.dateFormat = 'd/m/Y';
	options.messages = {invalid: "Date non valide, ex: 25/01/2007"};
	inputEx.FrenchDate.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FrenchDate, inputEx.DateField);
