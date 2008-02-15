/**
 * Define firebug functions as empty functions if firebug is not present
 */
/*if (!window.console || !console.firebug) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};
    for (var i = 0; i < names.length; ++i) {
        window.console[names[i]] = function() {};
    }
}*/

/** 
 * @fileoverview This files declares the main namespace of {@link http://javascript.neyric.com/inputex inputEx}
 */
var inputEx =  {
   
   /**
    * Url to the spacer image
    */
   spacerUrl: "images/space.gif", // 1x1 px
   
   /**
    * Shared messages
    */
   messages: {
   	required: "This field is required",
   	invalid: "This field is invalid",
   	valid: "This field is valid"
   },
   
   /**
    * Regular expressions
    */
   regexps: {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ipv4: /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/,
      url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i
   },
   
   /**
    * Associative array to convert types to classes
    */
   typeClasses: {
      /*
      color: inputEx.ColorField,
      ...
      */
   },
   
   /**
    * When you create a new inputEx Field Class, you can register it to give it a simple type.
    * ex:   inputEx.registerType("color", inputEx.ColorField);
    */
   registerType: function(type, field) {
      if(typeof type != "string") {
         throw new Error("inputEx.registerType: first argument must be a string");
      }
      if(typeof field != "function") {
         throw new Error("inputEx.registerType: second argument must be a function");
      }
      this.typeClasses[type] = field;
   },
   
   /**
    * Returns the class for the given type
    * ex: inputEx.getFieldClass("color") returns inputEx.ColorField
    */
   getFieldClass: function(type) {
      if(typeof this.typeClasses[type] == "function") {
         return this.typeClasses[type];
      }
      return null;
   },
   
   /**
    * Get the type for the given class: ex, inputEx.getType(inputEx.ColorField) returns "color"
    */
   getType: function(FieldClass) {
      for(var type in this.typeClasses) {
         if(this.typeClasses.hasOwnProperty(type) ) {
            if(this.typeClasses[FieldClass]) {
               return type;
            }
         }
      }
      return null;
   },
   
   /**
    * Functions used to create nodes
    * and set node attributes
    */
   sn: function(el,domAttributes,styleAttributes){
      if(!el) { return; }

      if(domAttributes){
         for(var i in domAttributes){
            var domAttribute = domAttributes[i];
            if(typeof (domAttribute)=="function"){
               continue;
            }
            /*if(YAHOO.env.ua.ie && i=="type" && (el.tagName=="INPUT"||el.tagName=="SELECT") ){
               continue;
            }*/
            if(i=="className"){
               i="class";
               el.className=domAttribute;
            }
            if(domAttribute!==el.getAttribute(i)){
               try{
                  if(domAttribute===false){
                     el.removeAttribute(i);
                  }else{
                     el.setAttribute(i,domAttribute);
                  }
               }
               catch(err){
                  //console.log("WARNING: WireIt.sn failed for "+el.tagName+", attr "+i+", val "+domAttribute);
               }
            }
         }
      }

      if(styleAttributes){
         for(var i in styleAttributes){
            if(typeof (styleAttributes[i])=="function"){
               continue;
            }
            if(el.style[i]!=styleAttributes[i]){
               el.style[i]=styleAttributes[i];
            }
         }
      }
   },


   /**
    * Create Node
    */
   cn: function(tag, domAttributes, styleAttributes, innerHTML){
      var el=document.createElement(tag);
      this.sn(el,domAttributes,styleAttributes);
      if(innerHTML){
         el.innerHTML = innerHTML;
      }
      return el;
   }
   
};



if(!Array.prototype.indexOf) {
   /**
    * The method Array.indexOf doesn't exist on IE :(
    */
   Array.prototype.indexOf = function(el) {
      for(var i = 0 ;i < this.length ; i++) {
         if(this[i] == el) return i;
      }
      return -1;
   };
}

if(!Array.prototype.compact) {
   /**
    * Compact
    */
   Array.prototype.compact = function() {
      var n = [];
      for(var i = 0 ; i < this.length ; i++) {
         if(this[i]) {
            n.push(this[i]);
         }
      }
      return n;
   };
}
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
	   return this.options.required ? inputEx.Field.stateRequired : inputEx.Field.stateEmpty;
	}
	return this.validate() ? inputEx.Field.stateValid : inputEx.Field.stateInvalid;
};
inputEx.Field.stateEmpty = 'empty';
inputEx.Field.stateRequired = 'required';
inputEx.Field.stateValid = 'valid';
inputEx.Field.stateInvalid = 'invalid';

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

/**
 * Handle a group of fields
 *
 * @class inputEx.Group
 * @constructor
 * @param {Array} inputConfigs Array of input fields : { label: 'Enter the value:' , type: 'text' or fieldClass: inputEx.Field, optional: true/false, inputParams: {inputparams object} }
 */
inputEx.Group = function(inputConfigs) {

   // Save the options locally
   this.inputConfigs = inputConfigs;
   
   /**
    * Array containing the list of the field instances
    */
   this.inputs = [];
   
   // Render the dom
   this.render();
   
   // Init the events
   this.initEvents();
};


inputEx.Group.prototype = {

   /**
    * Render the group
    */
   render: function() {
   
      // Create the div wrapper for this group
  	   this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
  	   
  	   this.renderFields(this.divEl);
  	  
   },
   
   /**
    * Render all the fields.
    * We use the parentEl so that inputEx.Form can append them to the FORM tag
    */
   renderFields: function(parentEl) {
      
      // Table containing non-optional fields
  	   var tableNonOptional = inputEx.cn('table');
  	   var tbodyNonOptional = inputEx.cn('tbody');
  	   tableNonOptional.appendChild(tbodyNonOptional);
  	   
  	   // Table containing optional fields
  	   this.tableOptional = inputEx.cn('table', {className: 'inputEx-Group-Options'}, {display: 'none'});
  	   var tbodyOptional = inputEx.cn('tbody');
  	   this.tableOptional.appendChild(tbodyOptional);
  	   
      // Iterate this.createInput on input fields
      for (var i = 0 ; i < this.inputConfigs.length ; i++) {
         var input = this.inputConfigs[i];

         var tr = inputEx.cn('tr');
         
         // Label element
         tr.appendChild( inputEx.cn('td', {className: 'inputEx-Group-label'}, null, input.label || "") );
        
    	   // Render the field (and adds it into this.inputs)
    	   var field = this.renderField(input);
    	   
    	   // If the input has the "optional" parameter, put it in the optionsEl
    	   var td = inputEx.cn('td');
         td.appendChild(field.getEl() );
         tr.appendChild(td);
            
         // Select the tbody to insert the row into
         var tbody = input.optional ? tbodyOptional : tbodyNonOptional;
         tbody.appendChild(tr);
  	   }
  	   
  	   // Append the non-optional table
  	   parentEl.appendChild(tableNonOptional);
  	  
  	   // Options: toggle the element
  	   if(tbodyOptional.childNodes.length > 0) {
 	      this.optionsLabel = inputEx.cn('div', {className: 'inputEx-Group-Options-Label inputEx-Group-Options-Label-Collapsed'});
 	      this.optionsLabel.appendChild( inputEx.cn('img', {src: inputEx.spacerUrl}) );
 	      this.optionsLabel.appendChild( inputEx.cn('span',null,null, "Options") );
 	      parentEl.appendChild(this.optionsLabel);
     	   parentEl.appendChild(this.tableOptional);
  	   }
  	   
   },
  
   /**
    * Instanciate one field given its parameters, type or fieldClass
    */
   renderField: function(input) {
      /**
   	 * Get the class for this field: if "type" is specified, we call inputEx.getFieldClass 
   	 * otherwise, we look for the "fieldClass" parameter.
   	 */
      var fieldClass = null;
   	if(input.type) {
   	   fieldClass = inputEx.getFieldClass(input.type);
   	   if(fieldClass === null) fieldClass = inputEx.Field;
   	}
   	else {
   	   fieldClass = input.fieldClass ? input.fieldClass : inputEx.Field;
   	}

      // Instanciate the field
   	this.inputs[i] = new fieldClass(input.inputParams);
   	  
      return this.inputs[i];
   },
  
   /**
    * Init the events for the group
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.optionsLabel, "click", this.onClickOptionsLabel, this, true);
   },
  
   /**
    * Handle the click on the "Options" label
    */
   onClickOptionsLabel: function() {
      if(this.tableOptional.style.display == 'none') {
         this.tableOptional.style.display = '';
         YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Collapsed", "inputEx-Group-Options-Label-Expanded");
      }
      else {
         this.tableOptional.style.display = 'none';
         YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Expanded", "inputEx-Group-Options-Label-Collapsed");
      }
   },
  
   /**
    * Return the group wrapper DIV element
    */
   getEl: function() {
      return this.divEl;
   },
   
   /**
    * Validate each field
    * @returns {Boolean} true if all fields validate and required fields are not empty
    */
   validate: function() {

   	// Validate all the sub fields
   	for (var i = 0 ; i < this.inputs.length ; i++) {
   		var input = this.inputs[i];
   		var state = input.getState();
   		if( state == inputEx.Field.stateRequired || state == inputEx.Field.stateInvalid ) {
   			return false;
   		}
      }
   	return true;
   },
   
   /**
    * Enable all fields in the group
    */
   enable: function() {
    	for (var i = 0 ; i < this.inputs.length ; i++) {
    	   this.inputs[i].enable();
      }
   },
   
   /**
    * Disable all fields in the group
    */
   disable: function() {
    	for (var i = 0 ; i < this.inputs.length ; i++) {
    	   this.inputs[i].disable();
      }
   },
   
   /**
    * Set the values of each field from a key/value hash object
    */
   setValue: function(oValues) { 
   	for (var i = 0 ; i < this.inputs.length ; i++) {
   		this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
   		this.inputs[i].setClassFromState();
      }
   },
   
   /**
    * Return an object with all the values of the fields
    */
   getValue: function() {
   	var o = {};
   	for (var i = 0 ; i < this.inputs.length ; i++) {
   	   if(this.inputs[i].options.name) {
   		   o[this.inputs[i].options.name] = this.inputs[i].getValue();
		   }
      }
   	return o;
   },
  
   /**
    * Close the group (recursively calls "close" on each field, does NOT hide the group )
    * Call this function before hidding the group to close any field popup
    */
   close: function() {
      for (var i = 0 ; i < this.inputs.length ; i++) {
  	      this.inputs[i].close();
      }
   }
   
};

﻿/**
 * Create a group of fields within a FORM tag
 *
 * @class inputEx.Form
 * @extends inputEx.Group
 * @constructor
 * 
 */
inputEx.Form = function(inputConfigs, buttons, options) {

  // Save the options locally
  this.buttons = buttons || [];
  this.options = options || {};

  inputEx.Form.superclass.constructor.call(this, inputConfigs);
};


YAHOO.extend(inputEx.Form, inputEx.Group, {
   
   
   /**
    * Render the group
    */
   render: function() {
   
      // Create the div wrapper for this group
  	   this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
  	   
  	   // Create the FORM element
   	this.form = inputEx.cn('form', {method: this.options.method || 'POST', action: this.options.action || '', className: this.options.className || 'inputEx-Form'});
   	this.divEl.appendChild(this.form);

   	// Set the autocomplete attribute to off to disable firefox autocompletion
   	this.form.setAttribute('autocomplete','off');
   	
   	// Set the name of the form
   	if(this.options.formName) { this.form.name = this.options.formName; }
  	   
  	   this.renderFields(this.form);

   	this.renderButtons();	  
   },
   
   /**
    * @method renderButtons
    * Render the buttons 
    */
   renderButtons: function() {
		
	   var button, buttonEl;
	   for(var i = 0 ; i < this.options.buttons.length ; i++ ) {
		   button = this.options.buttons[i];
		   buttonEl = inputEx.cn('input', {type: button.type, value: button.value});
		   if( button.onClick ) { buttonEl.onclick = button.onClick; }
		   this.divEl.appendChild(buttonEl);
	   }	
   },
   
   
   /**
    * Init the events
    */
   initEvents: function() {

      inputEx.Form.superclass.initEvents.call(this);

      // Handle the submit event
      YAHOO.util.Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
   },
   

   /**
    * @method onSubmitForm
    * Intercept the 'onsubmit' event and stop it if !validate
    */
   onSubmit: function(e) {
   	if ( !this.validate() ) {
   		YAHOO.util.Event.stopEvent(e);
   	} 
   }
   
});

/**
 * Create a <checkbox> input. Here are the added options :
 * <ul>
 *    <li>checked: boolean, initial state</li>
 *    <li>sentValues: couple of values that schould be returned by the getValue. (default: [true, false])</li>
 * </ul>
 *
 * @class inputEx.CheckBox
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.CheckBox = function(options) {
	inputEx.CheckBox.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.CheckBox, inputEx.Field, {
   
   /**
    * Adds the CheckBox specific options
    */
   setOptions: function() {
      inputEx.CheckBox.superclass.setOptions.call(this);
      
      this.sentValues = this.options.sentValues || [true, false];
      this.checkedValue = this.sentValues[0];
      this.uncheckedValue = this.sentValues[1];
   },
   
   /**
    * Render the checkbox and the hidden field
    */
   renderComponent: function() {
      this.el = inputEx.cn('input', {
           type: 'checkbox', 
           checked:(this.options.checked === false) ? false : true 
      });
      this.divEl.appendChild(this.el);

      this.label = inputEx.cn('label', {className: 'inputExForm-checkbox-rightLabel'}, null, this.options.label || '');
      this.divEl.appendChild(this.label);

      // Keep state of checkbox in a hidden field (format : this.checkedValue or this.uncheckedValue)
      this.hiddenEl = inputEx.cn('input', {type: 'hidden', name: this.options.name || '', value: this.el.checked ? this.checkedValue : this.uncheckedValue});
      this.divEl.appendChild(this.hiddenEl);
   },
   
   /**
    * Clear the previous events and listen for the "change" event
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.el, "change", this.toggleHiddenEl, this, true);	
   },
   
   /**
    * Function called when the checkbox is toggled
    */
   toggleHiddenEl: function() {
      this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
   },
   
   getValue: function() {
      return this.el.checked ? this.checkedValue : this.uncheckedValue;
   },
   
   setValue: function(value) {
       if (value===this.checkedValue) {
   		this.hiddenEl.value = value;
   		this.el.checked = true;
   	}
       else if (value===this.uncheckedValue) {
   		this.hiddenEl.value = value;
   		this.el.checked = false;
   	}
   	else {
   	    throw "Wrong value assignment in checkBox input";
   	}
   }
   
});


/**
 * Register this class as "boolean" type
 */
inputEx.registerType("boolean", inputEx.CheckBox);
/**
 * Create a Color picker input field
 *
 * @class   inputEx.ColorField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options same as parent class options
 */
inputEx.ColorField = function(options) {
	inputEx.ColorField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.ColorField, inputEx.Field, {
   
   renderComponent: function() {
      
      // A hidden input field to store the color code 
   	this.el = inputEx.cn('input', {
   	   type: 'hidden', 
   	   name: this.options.name || '', 
   	   value: this.options.value || '#DD7870' });
   	   
   	// Create a colored area
   	this.colorEl = inputEx.cn('div', {className: 'inputEx-ColorField'}, {backgroundColor: this.el.value});

   	// Render the popup
   	this.renderPopUp();

   	// Elements are bound to divEl
   	this.divEl.appendChild(this.el);
   	this.divEl.appendChild(this.colorEl);
   },
   
   initEvents: function() {
   	YAHOO.util.Event.addListener(this.colorEl, "click", this.toggleColorPopUp, this, true);
   	YAHOO.util.Event.addListener(this.colorEl, "blur", this.closeColorPopUp, this, true);
   },
   
   toggleColorPopUp: function() {
   	if( this.visible ) {	this.colorPopUp.style.display = 'none'; }
   	else { this.colorPopUp.style.display = 'block'; }
   	this.visible = !this.visible;
   },

   close: function() {
      this.closeColorPopUp();
   },

   closeColorPopUp: function() {
   	this.colorPopUp.style.display = 'none';
   	this.visible = false;
   },
   
   renderPopUp: function() {

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
   	this.colorPopUp = inputEx.cn('div', {className: 'inputEx-ColorField-popup'}, {width: width+'px', display: 'none'});

   	// create the title
   	if (this.displayTitle) {
         var div = inputEx.cn('div', null, null, inputEx.messages.selectColor);
         this.colorPopUp.appendChild( div );
      }

      var body = inputEx.cn('div');
      body.appendChild( this.renderColorGrid() );
      this.colorPopUp.appendChild(body);

      this.divEl.appendChild(this.colorPopUp);
   },
   
   setValue: function(value) {
      this.el.value = value;
      YAHOO.util.Dom.setStyle(this.colorEl, 'background-color', this.el.value);
   },
   
   setDefaultColors: function(index) {
   	return inputEx.ColorField.palettes[index-1];
   },
   
   
   /**
    * This creates a color grid
    */
   renderColorGrid: function() {
   	var table = inputEx.cn('table');
   	var tbody = inputEx.cn('tbody');
   	for(var i = 0; i<this.squaresPerColumn; i++) {
   		var line = inputEx.cn('tr');
   		for(var j = 0; j<this.squaresPerLine; j++) {

   			// spacer cells
   			line.appendChild( inputEx.cn('td', null, {backgroundColor: '#fff', lineHeight: '10px', cursor: 'default'}, "&nbsp;") );

   			// fill remaining space with empty and inactive squares
   			var square = inputEx.cn('td', null, {backgroundColor: '#fff', lineHeight: '10px', cursor: 'default'}, '&nbsp;&nbsp;&nbsp;');

   		    if (i===(this.squaresPerColumn-1) && j>=this.squaresOnLastLine ) {
   		       inputEx.sn(square, null, {backgroundColor: '#fff', cursor: 'default'});
   			 } 
   			 else {
    			   // create active squares
   		      inputEx.sn(square, null, {backgroundColor: '#'+this.colors[i*this.squaresPerLine+j], cursor: 'pointer'});
   				YAHOO.util.Event.addListener(square, "mousedown", this.onColorClick, this, true );
   			 }   
             line.appendChild(square);
   		}
   		tbody.appendChild(line);

   		// spacer line
   		tbody.appendChild( inputEx.cn('tr', null, {height: '8px'}) );
   	}
   	table.appendChild(tbody);
   	return table;
   },
   
   onColorClick: function(e) {
      
   	var square = YAHOO.util.Event.getTarget(e);//e.target;
   	
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
   	this.colorPopUp.style.display = 'none';
   }
   
});

// Specific message for the container
inputEx.messages.selectColor = "Select a color :";

// Default palettes
inputEx.ColorField.palettes = [
   ["FFEA99","FFFF66","FFCC99","FFCAB2","FF99AD","FFD6FF","FF6666","E8EEF7","ADC2FF","ADADFF","CCFFFF","D6EAAD","B5EDBC","CCFF99"],
   ["55AAFF","FFAAFF","FF7FAA","FF0202","FFD42A","F9F93B","DF8181","FEE3E2","D47FFF","2AD4FF","2AFFFF","AAFFD4"],
   ["000000","993300","333300","003300","003366","000080","333399","333333","800000","FF6600","808000","008000","008080","0000FF","666699","808080","FF0000","FF9900","99CC00","339966","33CCCC","3366FF","800080","969696","FF00FF","FFCC00","FFFF00","00FF00","00FFFF","00CCFF","993366","C0C0C0","FF99CC","FFCC99","FFFF99","CCFFCC","CCFFFF","99CCFF","CC99FF","F0F0F0"]
];



/**
 * Register this class as "color" type
 */
inputEx.registerType("color", inputEx.ColorField);
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
/**
 * Adds an IPv4 address regexp
 *
 * @class inputEx.IPv4Field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.IPv4Field = function(options) {
	inputEx.IPv4Field.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IPv4Field, inputEx.Field, {
   
   /**
    * set IPv4 regexp and invalid string
    */
   setOptions: function() {
      inputEx.IPv4Field.superclass.setOptions.call(this);
      this.options.messages.invalid = inputEx.messages.invalidIPv4;
   	this.options.regexp = inputEx.regexps.ipv4;
   }
   
});

// Specific message for the email field
inputEx.messages.invalidIPv4 = "Invalid IPv4 address, ex: 192.168.0.1";


/**
 * Register this class as "IPv4" type
 */
inputEx.registerType("IPv4", inputEx.IPv4Field);
/**
 * Create a list field
 *
 * @class   inputEx.ListField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options same as parent class options
 */
inputEx.ListField = function(options) {
   
   /**
    * List of all the subField instances
    */
   this.subFields = [];
   
   inputEx.ListField.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.ListField,inputEx.Field, {
   
   /**
    * Set the ListField classname
    */
   setOptions: function() {
      inputEx.ListField.superclass.setOptions.call(this);
      this.options.className='inputEx-Field inputEx-ListField';
   },
   
   /**
    * Render the addButton 
    */
   renderComponent: function() {
      
      // Add element button
      this.addButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-addButton'});
      this.divEl.appendChild(this.addButton);
      
      // List label
      this.divEl.appendChild( inputEx.cn('span', null, {marginLeft: "4px"}, this.options.listLabel) );
   },
   
   /**
    * Handle the click event on the add button
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.addButton, 'click', function() { this.addElement(); }, this, true);
   },
   
   /**
    * Set the value of all the subfields
    */
   setValue: function(value) {
      if(!value.length) return;
      
      // Set the values (and add the lines if necessary)
      for(var i = 0 ; i < value.length ; i++) {
         if(i == this.subFields.length) {
            this.addElement(value[i]);
         }
         else {
            this.subFields[i].setValue(value[i]);
         }
      }
      
      // Remove additional subFields
      var additionalElements = this.subFields.length-value.length;
      if(additionalElements > 0) {
         for(var i = 0 ; i < additionalElements ; i++) {
            this.removeElement(value.length);
         }
      }
   },
   
   /**
    * Return the array of values
    */
   getValue: function() {
      var values = [];
      for(var i = 0 ; i < this.subFields.length ; i++) {
         values[i] = this.subFields[i].getValue();
      }
      return values;
   },
   
   /**
    * Adds an element
    */
   addElement: function(value) {

      // Create the Options object for the subField
      var options = {};
      for(var key in this.options.elementOptions) {
         if(this.options.elementOptions.hasOwnProperty(key) ) {
            options[key] = this.options.elementOptions[key];
         }
      }
      if(value) { options.value = value; }

      // Render the subField
      var subFieldEl = this.renderSubField(options);
      
      // Adds it to the local list
      this.subFields.push(subFieldEl);
   },
   
   /**
    * Adds a new line to the List Field
    * @return  {inputEx.Field} instance of the created field (inputEx.Field or derivative)
    */
   renderSubField: function(options) {
      
      // Div that wraps the deleteButton + the subField
      var newDiv = inputEx.cn('div');
      
      // Delete button
      var delButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-delButton'});
      YAHOO.util.Event.addListener( delButton, 'click', this.onDelete, this, true);
      newDiv.appendChild( delButton );
      
      // Instanciate the new subField
      var el = new this.options.elementType(options);
      var subFieldEl = el.getEl();
      YAHOO.util.Dom.setStyle(subFieldEl, 'margin-left', '4px');
      YAHOO.util.Dom.setStyle(subFieldEl, 'float', 'left');
      newDiv.appendChild( subFieldEl );

      // Line breaker
      newDiv.appendChild( inputEx.cn('div', null, {clear: "both"}) );

      this.divEl.appendChild(newDiv);
      
      return el;
   },
   
   /**
    * Called when the user clicked on a delete button.
    */
   onDelete: function(e, params) {
      
      // Get the wrapping div element
      var elementDiv = e.originalTarget.parentNode;
      
      // Get the index of the subField
      var index = -1;
      var subFieldEl = elementDiv.childNodes[1];
      for(var i = 0 ; i < this.subFields.length ; i++) {
         if(this.subFields[i].getEl() == subFieldEl) {
            index = i;
            break;
         }
      }
      
      // Remove it
      if(index != -1) {
         this.removeElement(index);
      }
   },
   
   /**
    * Remove the line from the dom and the subField from the list.
    */
   removeElement: function(index) {
      
      var elementDiv = this.subFields[index].getEl().parentNode;
      
      this.subFields[index] = undefined;
      this.subFields = this.subFields.compact();
      
      // Remove the element
      elementDiv.parentNode.removeChild(elementDiv);
   }
   
});


/**
 * Register this class as "list" type
 */
inputEx.registerType("list", inputEx.ListField);

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
   }
});


/**
 * Register this class as "password" type
 */
inputEx.registerType("password", inputEx.PasswordField);
/**
 * Rich Text Editor
 *
 * @class inputEx.RTEField
 * @extends inputEx.Field
 */
inputEx.RTEField = function(options) {
   inputEx.RTEField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.RTEField, inputEx.Field, {
   
   render: function() {
      
      // Create a DIV element to wrap the editing el and the image
   	this.divEl = inputEx.cn('div', {className: this.options.className});
      
      this.el = inputEx.cn('textarea', {id: "msgpost"});
      this.divEl.appendChild(this.el);
      
      
      var myEditor = new YAHOO.widget.Editor("msgpost", {
          height: '300px',
          width: '522px',
          dompath: true
      });
      myEditor.render();
   }
   
});


/**
 * Register this class as "html" type
 */
inputEx.registerType("html", inputEx.RTEField);
/**
 * Create a <select> input, inherits from inputEx.Field
 *
 * @class inputEx.SelectField
 * @extends inputEx.Field
 *
 * options:
 *		- selectValues: contains the list of <options> values
 */
inputEx.SelectField = function(options) {
	inputEx.SelectField.superclass.constructor.call(this,options);
 };
YAHOO.lang.extend(inputEx.SelectField, inputEx.Field, {
   
   /**
    * Build a select tag with options
    */
   renderComponent: function() {
      
      this.el = inputEx.cn('select', {name: this.options.name || ''});
      
      if (this.options.multiple) {this.el.multiple = true; this.el.size = this.options.selectValues.length;}
      
      this.optionEls = [];
      for( var i = 0 ; i < this.options.selectValues.length ; i++) {
         this.optionEls[i] = inputEx.cn('option', {value: this.options.selectValues[i]}, null, (this.options.selectOptions) ? this.options.selectOptions[i] : this.options.selectValues[i]);
         this.el.appendChild(this.optionEls[i]);
      }
      this.divEl.appendChild(this.el);
   },
   
   
   /**
    * Register the "change" event
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.el,"change", this.onChange, this, true);
   },
   
   /**
    * Set the value
    */
   setValue: function(value) {
      var index = 0;
      var option;
      for(var i = 0 ; i < this.options.selectValues.length ; i++) {
         if(value === this.options.selectValues[i]) {
            option = this.el.childNodes[i];
   		 option.selected = "selected";
         }
      }
   },
   
   /**
    * Return the value
    */
   getValue: function() {
      return this.options.selectValues[this.el.selectedIndex];
   },
   
   /**
    * Called on the "change" event
    */
   onChange: function() {
      // Override me !
      //console.log("onChange");
   }
   
});

/**
 * Register this class as "select" type
 */
inputEx.registerType("select", inputEx.SelectField);






/**
 * Create a textarea input
 * Added options:
 * <ul>
 *	   <li>rows: rows attribute</li>
 *	   <li>cols: cols attribute</li>
 * </ul>
 *
 * @class inputEx.Textarea
 * @extends inputEx.Field
 */
inputEx.Textarea = function(options) {
	inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.Textarea, inputEx.Field, {
   
   setOptions: function() {
      inputEx.Textarea.superclass.setOptions.call(this);
      this.options.rows = this.options.rows || 6;
      this.options.cols = this.options.cols || 23;
   },
   
   renderComponent: function() {
      
      this.el = inputEx.cn('textarea', {
         value: this.options.value,
         rows: this.options.rows,
         cols: this.options.cols
      });
      
   	this.divEl.appendChild(this.el);
   }
   
});

/**
 * Register this class as "text" type
 */
inputEx.registerType("text", inputEx.Textarea);
/**
 * Adds an url regexp, and display the favicon at this url
 *
 * @class inputEx.UrlField
 * @extends inputEx.Field
 */
inputEx.UrlField = function(options) {
   inputEx.UrlField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.UrlField, inputEx.Field, {
   
   /**
    * Adds the invalid Url message
    */
   setOptions: function() {
      inputEx.UrlField.superclass.setOptions.call(this);
      this.options.className = "inputEx-Field inputEx-UrlField";
      this.options.messages.invalid = inputEx.messages.invalidUrl;
   },
   
   /**
    * Url are lower case
    */
   getValue: function() {
      return this.el.value.toLowerCase();
   },
   
   setValue: function(value) {
   	this.el.value = value;
   	this.validate();
   },
   
   /**
    * Adds a img tag before the field to display the favicon
    */
   render: function() {
      inputEx.UrlField.superclass.render.call(this);
      this.el.size = 27;

      // Create the favicon image tag
      this.favicon = inputEx.cn('img');
      this.divEl.insertBefore(this.favicon,this.el);
   },
   
   /**
    * Validate the field with an url regexp and set the favicon url
    */
   validate: function() {
      var url = this.getValue().match(inputEx.regexps.url);   
      
      var newSrc = url ? (url[0]+"/favicon.ico") : inputEx.spacerUrl;
      
      if(newSrc != this.favicon.src) {
         
         // Hide the favicon
         inputEx.sn(this.favicon, null, {visibility: 'hidden'});
      
         // Change the src
         this.favicon.src = newSrc;
      
         // Set the timer to launch displayFavicon in 1s
         if(this.timer) { clearTimeout(this.timer); }
   	   var that = this;
   	   this.timer = setTimeout(function(){that.displayFavicon();}, 1000);
      }
      	
      return !!url;
   },
   
   // Display the favicon if the icon was found (use of the naturalWidth property)
   displayFavicon: function() {
      inputEx.sn(this.favicon, null, {visibility: (this.favicon.naturalWidth!=0) ? 'visible' : 'hidden'});
   }
   
});


inputEx.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";


/**
 * Register this class as "url" type
 */
inputEx.registerType("url", inputEx.UrlField);
/**
 * Creates a type field with all the types in inpuEx.typeClasses
 *
 * @class inputEx.TypeField
 * @extends inputEx.SelectField
 * @constructor
 */
inputEx.TypeField = function(options) {
   
   var opts = {};
   for(var key in options) {
      if( options.hasOwnProperty(key) ) {
         opts[key] = options[key];
      }
   }
   // Build the "selectValues" property of SelectField options
   opts.selectValues = [];
   opts.selectOptions = [];
   for(var key in inputEx.typeClasses) {
      opts.selectValues.push( inputEx.typeClasses[key] );
      opts.selectOptions.push( key );
   }
   
   inputEx.TypeField.superclass.constructor.call(this, opts);
   
};

YAHOO.extend(inputEx.TypeField, inputEx.SelectField, {
   
   /**
    * Adds a div to wrap the component
    */
   renderComponent: function() {
      inputEx.TypeField.superclass.renderComponent.call(this);
      
      this.fieldWrapper = inputEx.cn('div');
      this.divEl.appendChild( this.fieldWrapper );
   },
   
   onChange: function() {
      
      // Get value is directly the class !!
      var classO = this.getValue();
      
      // Instanciate the field
      
      this.fieldWrapper.innerHTML = "";
      
      if(classO.groupOptions) {
         if(this.group) {
            this.group.close();
         }
         this.group = new inputEx.Group(classO.groupOptions);
         this.fieldWrapper.appendChild( this.group.getEl() );
      }
   },
   
   
   createField: function() {
   
      var classO = this.getValue();
      
      var opts = this.group.getValue();
      console.log(opts);
      
      var newField = new classO(opts);
      this.fieldWrapper.appendChild( newField.getEl() );
   }
   
});


/**
 * Register this class as "select" type
 */
inputEx.registerType("type", inputEx.TypeField);





/**
 * group Options for each field
 */
 
inputEx.Field.groupOptions = [
   { label: 'Numbers Only', type: inputEx.CheckBox, inputParams: {name: 'numbersOnly'} } 
];


inputEx.SelectField.groupOptions = [
   {  type: inputEx.ListField, inputParams: {name: 'selectValues', listLabel: 'selectValues', elementType: inputEx.Field, elementOptions: {}, required: true} },
   {  type: inputEx.ListField, inputParams: {name: 'selectOptions', listLabel: 'selectOptions', elementType: inputEx.Field, elementOptions: {} } }
];


inputEx.ListField.groupOptions = [
   { name: 'type', label: 'of type', type: inputEx.TypeField, inputParams: {required: true} } 
];
