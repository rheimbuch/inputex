/** 
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
 *			{label: "Phone", name: "phone", type: YAHOO.inputEx.Field, numbers: true, required: true},
 *			(See each params for each field)
 *		- buttons: list of buttons like:
 *			{value: "Valider", type: "submit"}
 */
YAHOO.inputEx.Form = function(options) {

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
YAHOO.inputEx.Form.prototype.onSubmit = function(e) {
	if ( !this.validate() ) {
		YAHOO.util.Event.stopEvent(e);
	} 
};

/**
 * @method validate
 * Return true if all the fields validates
 */
YAHOO.inputEx.Form.prototype.validate = function() {
	
	// Validate all the sub fields
	for (var i = 0 ; i < this.inputs.length ; i++) {
		var input = this.inputs[i];
		var state = input.getState();
		if( state == YAHOO.inputEx.Field.stateRequired || state == YAHOO.inputEx.Field.stateInvalid ) {
			return false;
		}
   }
	return true;
};
	
/**
 * @method getEl
 * Returns the form element
 */
YAHOO.inputEx.Form.prototype.getEl = function() {
   return this.form;
};

/**
 * @method getValue
 * Returns a javascript object of the name/value pairs
 */
YAHOO.inputEx.Form.prototype.getValue = function() {
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
YAHOO.inputEx.Form.prototype.enable = function(enable) {
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
YAHOO.inputEx.Form.prototype.setValue = function(oValues) { 
	for (var i = 0 ; i < this.inputs.length ; i++) {
		this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
		this.inputs[i].setClassFromState();
   }
};

/**
 * @method render
 * generates the dom of the form
 */
YAHOO.inputEx.Form.prototype.render = function() {
		
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
YAHOO.inputEx.Form.prototype.renderLabel = function(inputConfig, tdLabel) {
   if (inputConfig.label) {
		tdLabel.innerHTML = inputConfig.label;
	}
};

/**
 * @method renderInputFields
 * builds input fields
 */
YAHOO.inputEx.Form.prototype.renderInputFields = function() {
   
	// Array that will contain the references to the created Fields
	this.inputs = [];
		
	// Iterate this.createInput on input fields
	for (var i = 0 ; i < this.options.inputs.length ; i++) {
		var input = this.options.inputs[i];
		var tr = document.createElement('TR');
				
		var tdLabel = document.createElement('TD');
		this.renderLabel(input, tdLabel);
		
		var tdInput = document.createElement('TD');

		// Create the new field with the given type as class
		if( !input.type ) input.type = YAHOO.inputEx.Field;
      
      // Mask hidden fields
		if(input.type == YAHOO.inputEx.HiddenField) {
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
YAHOO.inputEx.Form.prototype.addGroupEntries = function() {
   
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
YAHOO.inputEx.Form.prototype.renderButtons = function() {
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
YAHOO.inputEx.Form.prototype.close = function() {
	for (var i = 0 ; i < this.inputs.length ; i++) {
		this.inputs[i].close();
   }
};