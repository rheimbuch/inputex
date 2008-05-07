/** 
 * @fileoverview Main inputEx file. It create an "inputEx" object in the global scope. 
 *   Schould be included first before all other inputEx files
 */

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
 * @namespace The inputEx global namespace object.
 */
var inputEx =  {
   
   /**
    * Url to the spacer image. This url schould be changed according to your project directories
    * @type String
    */
   spacerUrl: "images/space.gif", // 1x1 px
   
   /**
    * Field empty state constant
    * @type String
    */
   stateEmpty: 'empty',
   
   /**
    * Field required state constant
    * @type String
    */
   stateRequired: 'required',
   
   /**
    * Field valid state constant
    * @type String
    */
   stateValid: 'valid',
   
   /**
    * Field invalid state constant
    * @type String
    */
   stateInvalid: 'invalid',
   
   /**
    * Associative array containing field messages
    */
   messages: {
   	required: "This field is required",
   	invalid: "This field is invalid",
   	valid: "This field is valid"
   },
   
   /**
    * Associative array containing common regular expressions
    */
   regexps: {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ipv4: /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/,
      url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i,
      password: /^[0-9a-zA-Z\x20-\x7E]*$/
   },
   
   /**
    * Hash between inputEx types and classes (ex: <code>inputEx.typeClasses.color = inputEx.ColorField</code>)<br />
    * Please register the types with the <code>registerType</code> method
    */
   typeClasses: {},
   
   /**
    * When you create a new inputEx Field Class, you can register it to give it a simple type.
    * ex:   inputEx.registerType("color", inputEx.ColorField);
    * @static
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
    * @static
    */
   getFieldClass: function(type) {
      if(typeof this.typeClasses[type] == "function") {
         return this.typeClasses[type];
      }
      return null;
   },
   
   /**
    * Get the inputex type for the given class (ex: <code>inputEx.getType(inputEx.ColorField)</code> returns "color")
    * @static
    * @param {inputEx.Field} FieldClass An inputEx.Field or derivated class
    * @return {String} returns the inputEx type string or <code>null</code>
    */
   getType: function(FieldClass) {
      for(var type in this.typeClasses) {
         if(this.typeClasses.hasOwnProperty(type) ) {
            if(this.typeClasses[type] == FieldClass) {
               return type;
            }
         }
      }
      return null;
   },
   
   /**
    * Build a field from an object like: { type: 'color' or fieldClass: inputEx.ColorField, inputParams: {} }<br />
    * The inputParams property is the object that will be passed as the <code>options</code> parameter to the field class constructor.<br />
    * If the neither type or fieldClass are found, it uses inputEx.StringField
    * @static
    * @param {Object} fieldOptions
    * @return {inputEx.Field} Created field instance
    */
   buildField: function(fieldOptions) {
      var fieldClass = null;
   	if(fieldOptions.type) {
   	   fieldClass = this.getFieldClass(fieldOptions.type);
   	   if(fieldClass === null) fieldClass = inputEx.StringField;
   	}
   	else {
   	   fieldClass = fieldOptions.fieldClass ? fieldOptions.fieldClass : inputEx.StringField;
   	}

      // Instanciate the field
      var inputInstance = new fieldClass(fieldOptions.inputParams);
   	  
      return inputInstance;
   },
   
   /**
    * Helper function to set DOM node attributes and style attributes.
    * @static
    * @param {HTMLElement} el The element to set attributes to
    * @param {Object} domAttributes An object containing key/value pairs to set as node attributes (ex: {id: 'myElement', className: 'myCssClass', ...})
    * @param {Object} styleAttributes Same thing for style attributes. Please use camelCase for style attributes (ex: backgroundColor for 'background-color')
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
    * Helper function to create a DOM node. (wrapps the document.createElement tag and the inputEx.sn functions)
    * @static
    * @param {String} tag The tagName to create (ex: 'div', 'a', ...)
    * @param {Object} [domAttributes] see inputEx.sn
    * @param {Object} [styleAttributes] see inputEx.sn
    * @param {String} [innerHTML] The html string to append into the created element
    * @return {HTMLElement} The created node
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
    * Find the position of the given element. (This method is not available in IE 6)
    * @param {Object} el Value to search
    * @return {number} Element position, -1 if not found
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
    * Create a new array without the falsy elements
    * @return {Array} Array without falsy elements
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
 * @class An abstract class that contains the shared features for all fields
 * @constructor
 * @param {Object} options Options object (see options property)
 */
inputEx.Field = function(options) {
	
	/**
	 * All the field constructors use a unique parameter "options".
	 * <ul>
    *	  <li>name: the name of the field</li>
    *	  <li>required: boolean, the field cannot be null if true</li>
    *	  <li>tooltipIcon: show an icon next to the field and display an error in a tooltip (default false)</li>
    *   <li>className: CSS class name for the div wrapper (default 'inputEx-Field')</li>
    *   <li>value: initial value</li>
    *   <li>parentEl: HTMLElement or String id, append the field to this DOM element</li>
    * </ul>
	 */
	this.options = options || {};
	
	// Set the default values of the options
	this.setOptions();
	
	// Call the render of the dom
	this.render();
	
	// Set the initial value
	if(!YAHOO.lang.isUndefined(this.options.value)) {
		this.setValue(this.options.value);
	}
	
	/**
	 * @event
	 * @param {Any} value The new value of the field
	 * @desc YAHOO custom event fired when the field is "updated"<br /> subscribe with: this.updatedEvt.subscribe(function(e, params) { var value = params[0]; console.log("updated",value, this.updatedEvt); }, this, true);
	 */
	this.updatedEvt = new YAHOO.util.CustomEvent('updated', this);
	
	// initialize behaviour events
	this.initEvents();
	
	// set the default styling
	this.setClassFromState();
	
	// append it immediatly to the parent DOM element
	if(this.options.parentEl) {
	   if(typeof this.options.parentEl == "string") {
	     YAHOO.util.Dom.get(this.options.parentEl).appendChild(this.getEl());  
	   }
	   else {
	      this.options.parentEl.appendChild(this.getEl());
      }
	}
};


inputEx.Field.prototype = {
  
   /**
    * Set the default values of the options
    */
	setOptions: function() {
   
      // Define default messages
	   this.options.messages = this.options.messages || {};
	   this.options.messages.required = this.options.messages.required || inputEx.messages.required;
	   this.options.messages.invalid = this.options.messages.invalid || inputEx.messages.invalid;
	   this.options.messages.valid = this.options.messages.valid || inputEx.messages.valid;
	
	   // Other options
	   this.options.className = this.options.className || 'inputEx-Field';
	   this.options.required = this.options.required ? true : false;
	   this.options.tooltipIcon = this.options.tooltipIcon ? true : false;
	
	   // The following options are used later:
	   // + this.options.name
	   // + this.options.value
	},

   /**
    * Default render of the dom element. Create a divEl that wraps the field.
    */
	render: function() {
	
	   // Create a DIV element to wrap the editing el and the image
	   this.divEl = inputEx.cn('div', {className: this.options.className});
	
      // Render the component directly
      this.renderComponent();
	
	   // Create a div next to the field with an icon and a tooltip
	   if( this.options.tooltipIcon ) {
		   this.tooltipIcon = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-Field-stateIcon'});
		   if(!inputEx.tooltipCount) { inputEx.tooltipCount = 0; }
   	   this.tooltip = new YAHOO.widget.Tooltip('inputEx-tooltip-'+(inputEx.tooltipCount++), { context: this.tooltipIcon, text:"" }); 
		   this.divEl.appendChild(this.tooltipIcon);
	   }
	
	},
	
	/**
	 * Fire the "updated" event (only if the field validated)
	 * Escape the stack using a setTimeout
	 */
	fireUpdatedEvt: function() {
      if(this.validate()) {
         // Uses setTimeout to escape the stack (that originiated in an event)
         var that = this;
         setTimeout(function() {
      	   that.updatedEvt.fire(that.getValue());
         },50);
      }
	},

   /**
    * Render the interface component into this.divEl
    */
	renderComponent: function() {
	},

   /**
    * The default render creates a div to put in the messages
    * @return {HTMLElement} divEl The main DIV wrapper
    */
	getEl: function() {
	   return this.divEl;
	},

   /**
    * Initialize events of the Input
    */
	initEvents: function() {
	},

   /**
    * Return the value of the input
    * @return {Any} value of the field
    */
	getValue: function() { 
	   // override me
	},

   /**
    * Function to set the value
    * @param {Any} value The new value
    */
	setValue: function(value) {
	   // override me
	},

   /**
    * Set the styles for valid/invalide state
    */
	setClassFromState: function() {
	
	   if( this.previousState ) {
		   YAHOO.util.Dom.removeClass(this.getEl(), 'inputEx-'+this.previousState );
	   }
	   this.previousState = this.getState();
	   YAHOO.util.Dom.addClass(this.getEl(), 'inputEx-'+this.previousState );
	
	   this.setToolTipMessage();
	},

   /**
    * Get the string for the given state
    */
	getStateString: function(state) {
      if(state == 'required') {
         return this.options.messages.required;
      }
      else if(state == 'invalid') {
         return this.options.messages.invalid;
      }
      else {
         return this.options.messages.valid;
      }
	},

   /**   
    * Set the tooltip message
    */ 
	setToolTipMessage: function() { 
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
	},


   /**
    * Returns the current state (given its value)
    * @return {String} One of the following states: 'empty', 'required', 'valid' or 'invalid'
    */
	getState: function() { 
	   // if the field is empty :
	   if( this.getValue() === '' ) {
	      return this.options.required ? inputEx.stateRequired : inputEx.stateEmpty;
	   }
	   return this.validate() ? inputEx.stateValid : inputEx.stateInvalid;
	},

   /**
    * Validation of the field
    * @return {Boolean} field validation status (true/false)
    */
	validate: function() {
      return true;
   },

   /**
    * Function called on the focus event
    * @param {Event} e The original event
    */
	onFocus: function(e) {
	   YAHOO.util.Dom.addClass(this.getEl(), 'inputEx-focused');
	},

   /**
    * Function called on the blur event
    * @param {Event} e The original event
    */
	onBlur: function(e) {
	   YAHOO.util.Dom.removeClass(this.getEl(), 'inputEx-focused');
	},

   /**
    * onChange event handler
    * @param {Event} e The original event
    */
	onChange: function(e) {
	   this.setClassFromState();
      this.fireUpdatedEvt();
	},

   /**
    * Close the field and eventually opened popups...
    */
	close: function() {
	},

   /**
    * Disable the field
    */
	disable: function() {
	},

   /**
    * Enable the field
    */
	enable: function() {
	}


};/**
 * @class Handle a group of fields
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options with optionsLabel,fields: Array of input fields : { label: 'Enter the value:' , type: 'text' or fieldClass: inputEx.Field, optional: true/false, inputParams: {inputparams object} }
 */
inputEx.Group = function(options) {
   inputEx.Group.superclass.constructor.call(this,options);
};
YAHOO.extend(inputEx.Group, inputEx.Field);

inputEx.Group.prototype.setOptions = function() {
   this.options.optionsLabel = this.options.optionsLabel || 'Options';
   this.inputConfigs = this.options.fields;
      
   // Array containing the list of the field instances
   this.inputs = [];

   // Associative array containing the field instances by names
   this.inputsNames = {};
};

/**
 * Render the group
 */
inputEx.Group.prototype.render= function() {
   
   // Create the div wrapper for this group
	this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
  	   
  	this.renderFields(this.divEl);  	  
};
   
/**
 * Render all the fields.
 * We use the parentEl so that inputEx.Form can append them to the FORM tag
 */
inputEx.Group.prototype.renderFields = function(parentEl) {
      
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
         
      // Hide the row if type == "hidden"
      if(input.type == 'hidden') {
         YAHOO.util.Dom.setStyle(tr, 'display', 'none');
      }
         
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
  	this.tableNonOptional = tableNonOptional;
  	parentEl.appendChild(tableNonOptional);
  	  
  	// Options: toggle the element
  	if(tbodyOptional.childNodes.length > 0) {
 	   this.optionsLabel = inputEx.cn('div', {className: 'inputEx-Group-Options-Label inputEx-Group-Options-Label-Collapsed'});
 	   this.optionsLabel.appendChild( inputEx.cn('img', {src: inputEx.spacerUrl}) );
 	   this.optionsLabel.appendChild( inputEx.cn('span',null,null, this.options.optionsLabel) );
 	   parentEl.appendChild(this.optionsLabel);
    	parentEl.appendChild(this.tableOptional);
  	}
  	   
};
  
/**
 * Instanciate one field given its parameters, type or fieldClass
 */
inputEx.Group.prototype.renderField = function(fieldOptions) {

   // Instanciate the field
   var fieldInstance = inputEx.buildField(fieldOptions);      
      
	this.inputs.push(fieldInstance);
      
   // Store link between field_name and field_position in group
	if (!!fieldInstance.el && !!fieldInstance.el.name) {
      this.inputsNames[fieldInstance.el.name] = fieldInstance;
   }
      
	// Subscribe to the field "updated" event to send the group "updated" event
   fieldInstance.updatedEvt.subscribe(this.onChange, this, true);
   	  
   return fieldInstance;
};
  
/**
 * Init the events for the group
 */
inputEx.Group.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.optionsLabel, "click", this.onClickOptionsLabel, this, true);
};
  
/**
 * Handle the click on the "Options" label
 */
inputEx.Group.prototype.onClickOptionsLabel = function() {
   if(this.tableOptional.style.display == 'none') {
      this.tableOptional.style.display = '';
      YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Collapsed", "inputEx-Group-Options-Label-Expanded");
   }
   else {
      this.tableOptional.style.display = 'none';
      YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Expanded", "inputEx-Group-Options-Label-Collapsed");
   }
};
  
/**
 * Return the group wrapper DIV element
 */
inputEx.Group.prototype.getEl = function() {
   return this.divEl;
};
   
/**
 * Validate each field
 * @returns {Boolean} true if all fields validate and required fields are not empty
 */
inputEx.Group.prototype.validate = function() {
   // Validate all the sub fields
   for (var i = 0 ; i < this.inputs.length ; i++) {
   	var input = this.inputs[i];
   	var state = input.getState();
   	if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
   		return false;
   	}
   }
   return true;
};
   
/**
 * Enable all fields in the group
 */
inputEx.Group.prototype.enable = function() {
 	for (var i = 0 ; i < this.inputs.length ; i++) {
 	   this.inputs[i].enable();
   }
};
   
/**
 * Disable all fields in the group
 */
inputEx.Group.prototype.disable = function() {
 	for (var i = 0 ; i < this.inputs.length ; i++) {
 	   this.inputs[i].disable();
   }
};
   
/**
 * Set the values of each field from a key/value hash object
 */
inputEx.Group.prototype.setValue = function(oValues) { 
   if(!oValues) return;
	for (var i = 0 ; i < this.inputs.length ; i++) {
	   if(this.inputs[i].options.name && !YAHOO.lang.isUndefined(oValues[this.inputs[i].options.name]) ) {
		   this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
		   this.inputs[i].setClassFromState();
	   }
   }
};
   
/**
 * Return an object with all the values of the fields
 */
inputEx.Group.prototype.getValue = function() {
	var o = {};
	for (var i = 0 ; i < this.inputs.length ; i++) {
	   if(this.inputs[i].options.name) {
		   o[this.inputs[i].options.name] = this.inputs[i].getValue();
	   }
   }
	return o;
};
  
/**
 * Close the group (recursively calls "close" on each field, does NOT hide the group )
 * Call this function before hidding the group to close any field popup
 */
inputEx.Group.prototype.close = function() {
   for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].close();
   }
};
   
/**
 * Register this class as "group" type
 */
inputEx.registerType("group", inputEx.Group);
﻿/**
 * @class Create a group of fields within a FORM tag
 * @extends inputEx.Group
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.Form = function(options) { 
   inputEx.Form.superclass.constructor.call(this, options);
};
YAHOO.extend(inputEx.Form, inputEx.Group);

/**
 * Adds buttons and set ajax default parameters
 */
inputEx.Form.prototype.setOptions = function() {
   inputEx.Form.superclass.setOptions.call(this);
   
   this.buttons = this.options.buttons;
   
   if(this.options.ajax) {
      this.options.ajax.method = this.options.ajax.method || 'POST';
      this.options.ajax.uri = this.options.ajax.uri || 'default.php';
      this.options.ajax.callback = this.options.ajax.callback || {};
      this.options.ajax.callback.scope = this.options.ajax.callback.scope || this;
   }
};
   
/**
 * Render the group
 */
inputEx.Form.prototype.render = function() {
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
};
   
/**
 * @method renderButtons
 * Render the buttons 
 */
inputEx.Form.prototype.renderButtons= function() {
		
	var button, buttonEl;
	for(var i = 0 ; i < this.buttons.length ; i++ ) {
	   button = this.buttons[i];
	   buttonEl = inputEx.cn('input', {type: button.type, value: button.value});
	   if( button.onClick ) { buttonEl.onclick = button.onClick; }
	   this.form.appendChild(buttonEl);
	}	
};
   
   
/**
 * Init the events
 */
inputEx.Form.prototype.initEvents = function() {
   inputEx.Form.superclass.initEvents.call(this);

   // Handle the submit event
   YAHOO.util.Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
};
   
/**
 * Intercept the 'onsubmit' event and stop it if !validate
 * If the ajax option object is set, use YUI async Request to send the form
 * @param {Event} e The original onSubmit event
 */
inputEx.Form.prototype.onSubmit = function(e) {
	if ( !this.validate() ) {
		YAHOO.util.Event.stopEvent(e);
	} 
	if(this.options.ajax) {
		YAHOO.util.Event.stopEvent(e);
	   this.asyncRequest();
	}
};
  
/**
 * Send the form value in JSON through an ajax request
 */
inputEx.Form.prototype.asyncRequest = function() { 
	//this.showMask();
	var postData = "value="+YAHOO.lang.JSON.stringify(this.getValue());
   YAHOO.util.Connect.asyncRequest(this.options.ajax.method, this.options.ajax.uri, { 
      success: function(o) {
         //this.hideMask();
         if(typeof this.options.ajax.callback.success == "function") {
            this.options.ajax.callback.success.call(this.options.ajax.callback.scope,o);
         }
      }, 
      
      failure: function(o) {
         //this.hideMask();
         if(typeof this.options.ajax.callback.failure == "function") {
            this.options.ajax.callback.failure.call(this.options.ajax.callback.scope,o);
         }
      }, 
      
      scope:this 
   }, postData);
};
  
/**
 * Create a Mask over the form
 *
inputEx.Form.prototype.renderMask = function() {
   if(this.maskRendered) return;
   
   YAHOO.util.Dom.setStyle(this.divEl, "position", "relative");
   this.formMask = inputEx.cn('div', {className: 'inputEx-Form-Mask'}, 
      {
         display: 'none', 
         width: YAHOO.util.Dom.getStyle(this.divEl,"width"),
         height: YAHOO.util.Dom.getStyle(this.divEl,"height"),
      }, 
      "<div/><center><br /><img src='../images/spinner.gif'/><br /><span>Envoi en cours...</span></center>");
   this.divEl.appendChild(this.formMask);
   this.maskRendered = true;
};*/

/**
 * Show the form mask
 *
inputEx.Form.prototype.showMask = function() {
   this.renderMask();
   this.formMask.style.display = '';
};
*/

/**
 * Hide the form mask
 *
inputEx.Form.prototype.hideMask = function() {
   this.formMask.style.display = 'none';
};*/


/**
* Register this class as "form" type
*/
inputEx.registerType("form", inputEx.Form);/**
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
 * Register this class as "string" type
 */
inputEx.registerType("string", inputEx.StringField);

/**
 * @class An autocomplete module
 * @constructor
 * @extends inputEx.StringField
 */
 
inputEx.AutoComplete = function(options) {
   inputEx.AutoComplete.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.AutoComplete, inputEx.StringField);

/**
 * Adds autocomplete options
 */
inputEx.AutoComplete.prototype.setOptions = function() {
   
   this.options.className = this.options.className || 'inputEx-Field inputEx-AutoComplete';
   
   inputEx.AutoComplete.superclass.setOptions.call(this);
   
   this.options.highlightClass = 'inputEx-AutoComplete-ItemHovered';
   this.options.timerDelay = this.options.timerDelay || 300;
   this.options.query = this.options.query || null;
   this.options.queryMinLength = this.options.queryMinLength || 2;
   this.options.displayEl = this.options.displayEl || function(val) { return inputEx.cn('div', null, null, val); };
};

/**
 * Render the hidden list element
 */
inputEx.AutoComplete.prototype.renderComponent = function() {
   
   inputEx.AutoComplete.superclass.renderComponent.call(this);
   
   // Render the list :
   this.listEl = inputEx.cn('div', {className: 'inputEx-AutoComplete-List'}, {display: 'none'});
   this.divEl.appendChild(this.listEl);
};

/**
 * Register some additional events
 */
inputEx.AutoComplete.prototype.initEvents = function() {
   inputEx.AutoComplete.superclass.initEvents.call(this);
   
   YAHOO.util.Event.addListener(this.listEl, "click", this.validateItem, this, true);
   YAHOO.util.Event.addListener(this.listEl, "mouseover", this.onListMouseOver, this, true);
   
   YAHOO.util.Event.addListener(this.el, "keydown", this.onKeyDown, this, true);
};


/**
 * Listen for up/down keys
 */
inputEx.AutoComplete.prototype.onKeyDown = function(e) {
   
   // up/down keys
   if( e.keyCode == 40 || e.keyCode == 38) {
   
      var pos = -1;
      for(var i = 0 ; i < this.listEl.childNodes.length ; i++) {
         if(this.listEl.childNodes[i]==this.highlightedItem) {
            pos = i;
            break;
         }
      }
   
      var lastPos = this.listEl.childNodes.length-1;
      var indexItemToHighlight = (e.keyCode == 40) ? (pos < lastPos ? pos+1 : 0) : (pos != 0 ? pos-1 : lastPos);
      var liItem = this.listEl.childNodes[indexItemToHighlight];
            
      if(liItem) {
         this.highlightItem(liItem);
         YAHOO.util.Event.stopEvent(e);
      }
   }
   
};


/**
 * Start the typing timer on Input
 */
inputEx.AutoComplete.prototype.onInput = function(e) { 
   inputEx.AutoComplete.superclass.onInput.call(this, e);
   
   // Key enter
   if(e.keyCode == 13) {
      YAHOO.util.Event.stopEvent(e);
      this.validateItem();
	   return;
   }
   
   
   if( e.keyCode == 40 || e.keyCode == 38) {
      return;
   }
   
   
   /**
    * If this is a normal key, make the query
    */
   
   // trim whitespaces (remove spaces at beginning and end of string)
   var value = this.getValue().replace(/^\s+/g, '').replace(/\s+$/g, ''); 

   if(value.length >= this.options.queryMinLength ) {
      this.resetTimer();
   }
   else {
      this.stopTimer();
      this.hideList();
   }
   
};

/**
 * Validate the item
 */
inputEx.AutoComplete.prototype.validateItem = function() {
   
   var pos = -1;
   for(var i = 0 ; i < this.listEl.childNodes.length ; i++) {
      if(this.listEl.childNodes[i]==this.highlightedItem) {
         pos = i;
         break;
      }
   }
   if(pos == -1) { return; }
   
   this.setValue( this.options.displayAutocompleted.call(this, this.listValues[pos]) );
   this.hideList();
};

/**
 * Hide the list
 */
inputEx.AutoComplete.prototype.hideList = function() {
   this.listEl.style.display = 'none';
};

/**
 * Show the list
 */
inputEx.AutoComplete.prototype.showList = function() {
 this.listEl.style.display = '';
};

/**
 * Run the query function
 */
inputEx.AutoComplete.prototype.queryList = function(value) {
   this.options.query.call(this, value);
};

/**
 * Function to populate the list
 */
inputEx.AutoComplete.prototype.updateList = function(list) {
   
   this.listValues = list;
   
   this.listEl.innerHTML = "";
   
   // Call a rendering function:
   for(var i = 0 ; i < list.length ; i++) {
      var el = inputEx.cn('div', {className: 'inputEx-AutoComplete-Item'});
      el.appendChild( this.options.displayEl.call(this,list[i]) );
      this.listEl.appendChild(el);
   }
   
   // Make the list visible
   this.showList();
};

/**
 * The timer is used to wait a little before sending the request, so that we don't send too much requests.
 */
inputEx.AutoComplete.prototype.resetTimer = function() {
   if( this.timer ) {
      clearTimeout(this.timer);
   }
   var that = this;
   this.timer = setTimeout(function() { that.timerEnd(); }, this.options.timerDelay);
};


inputEx.AutoComplete.prototype.stopTimer = function() {
   if( this.timer ) {
      clearTimeout(this.timer);
   }
};

/**
 * Send the request when the timer ends.
 */
inputEx.AutoComplete.prototype.timerEnd = function() {
   var value = this.getValue().replace(/^\s+/g, '').replace(/\s+$/g, ''); 
	
   this.queryList(value);
};



inputEx.AutoComplete.prototype.onBlur = function(e) {
   inputEx.AutoComplete.superclass.onBlur.call(this, e);
   //console.log("blur",e);
   
   // TODO: we must do something like this
   // but it is fired before the click event !
   //this.hideList();
};


/**
 * Set the highlighted item
 */
inputEx.AutoComplete.prototype.highlightItem = function(liItem) {
   this.toggleHighlightItem(this.highlightedItem, false);
   this.toggleHighlightItem(liItem, true);
   this.highlightedItem = liItem;
};


/**
 * Hightlight or unhighlight an item from the list
 */
inputEx.AutoComplete.prototype.toggleHighlightItem = function(liItem, highlight) {
   if(highlight) {
     YAHOO.util.Dom.addClass(liItem, this.options.highlightClass);
   }
   else {
     YAHOO.util.Dom.removeClass(liItem, this.options.highlightClass);
   }
};

/**
 * Highlight the overed item
 */ 
inputEx.AutoComplete.prototype.onListMouseOver = function(e) {
   var target = YAHOO.util.Event.getTarget(e);
   if( YAHOO.util.Dom.hasClass(target, 'inputEx-AutoComplete-Item') ) {
      this.highlightItem(target);
   }
};
/**
 * @class Create a checkbox. Here are the added options :
 * <ul>
 *    <li>checked: boolean, initial state</li>
 *    <li>sentValues: couple of values that schould be returned by the getValue. (default: [true, false])</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.CheckBox = function(options) {
	inputEx.CheckBox.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.CheckBox, inputEx.Field);
   
/**
 * Adds the CheckBox specific options
 */
inputEx.CheckBox.prototype.setOptions = function() {
   inputEx.CheckBox.superclass.setOptions.call(this);
   
   this.sentValues = this.options.sentValues || [true, false];
   this.checkedValue = this.sentValues[0];
   this.uncheckedValue = this.sentValues[1];
};
   
/**
 * Render the checkbox and the hidden field
 */
inputEx.CheckBox.prototype.renderComponent = function() {

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
};
   
/**
 * Clear the previous events and listen for the "change" event
 */
inputEx.CheckBox.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.el, "change", this.onChange, this, true);	
};
   
/**
 * Function called when the checkbox is toggled
 */
inputEx.CheckBox.prototype.onChange = function(e) {
   this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
   
   inputEx.CheckBox.superclass.onChange.call(this,e);
};

/**
 * @return {Any} one of [checkedValue,uncheckedValue]
 */
inputEx.CheckBox.prototype.getValue = function() {
      return this.el.checked ? this.checkedValue : this.uncheckedValue;
};

/**
 * Set the value of the checkedbox
 * @param {Any} value The value schould be one of [checkedValue,uncheckedValue]
 * TODO: Throw an exception otherwise ?
 */
inputEx.CheckBox.prototype.setValue = function(value) {
   if (value===this.checkedValue) {
		this.hiddenEl.value = value;
		this.el.checked = true;
	}
   else if (value===this.uncheckedValue) {
		this.hiddenEl.value = value;
		this.el.checked = false;
	}
};
   

/**
 * Register this class as "boolean" type
 */
inputEx.registerType("boolean", inputEx.CheckBox);
/**
 * @class Create a Color picker input field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.ColorField = function(options) {
	inputEx.ColorField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.ColorField, inputEx.Field);

   
inputEx.ColorField.prototype.renderComponent = function() {
      
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
};
   
inputEx.ColorField.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.colorEl, "click", this.toggleColorPopUp, this, true);
   YAHOO.util.Event.addListener(this.colorEl, "blur", this.closeColorPopUp, this, true);
};
   
inputEx.ColorField.prototype.toggleColorPopUp = function() {
   if( this.visible ) {	this.colorPopUp.style.display = 'none'; }
   else { this.colorPopUp.style.display = 'block'; }
   this.visible = !this.visible;
};

inputEx.ColorField.prototype.close = function() {
   this.closeColorPopUp();
};

inputEx.ColorField.prototype.closeColorPopUp = function() {
	this.colorPopUp.style.display = 'none';
	this.visible = false;
};
   
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
};
   
inputEx.ColorField.prototype.setValue = function(value) {
   this.el.value = value;
   YAHOO.util.Dom.setStyle(this.colorEl, 'background-color', this.el.value);
};
   
inputEx.ColorField.prototype.setDefaultColors = function(index) {
	return inputEx.ColorField.palettes[index-1];
};
      
/**
 * This creates a color grid
 */
inputEx.ColorField.prototype.renderColorGrid = function() {
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
};
   
inputEx.ColorField.prototype.onColorClick = function(e) {
      
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
   	
   // Fire updated
   this.fireUpdatedEvt();
};
   

// Specific message for the container
inputEx.messages.selectColor = "Select a color :";

/**
 * Default palettes
 */
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
 * @class A Date Field. Add the folowing options: 
 *		- dateFormat: default to 'm/d/Y'
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.DateField = function(options) {
   if(!options) { var options = {}; }
   if(!options.messages) { options.messages = {}; }
	if(!options.dateFormat) {options.dateFormat = 'm/d/Y'; }
	options.messages.invalid = inputEx.messages.invalidDate;
	inputEx.DateField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.DateField, inputEx.StringField);
   
/**
 * Specific Date validation
 */
inputEx.DateField.prototype.validate = function() {
   var value = this.el.value;
   var ladate = value.split("/");
   if( ladate.length != 3) { return false; }
   if ( isNaN(parseInt(ladate[0])) || isNaN(parseInt(ladate[1])) || isNaN(parseInt(ladate[2]))) { return false; }
   var formatSplit = this.options.dateFormat.split("/");
   if (ladate[ formatSplit.indexOf('Y') ].length!=4) { return false; } // Avoid 3-digits years...
   var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
   var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
   var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   var unedate = new Date(Y,m,d);
   var annee = unedate.getFullYear();
   return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
};

/*
inputEx.DateField.prototype.render = function() {
   	inputEx.DateField.superclass.render.call(this);
};*/
   
/**
 * Format the date according to options.dateFormat
 * param {Date} val Date to set
 */
inputEx.DateField.prototype.setValue = function(val) {

   // Don't try to parse a date if there is no date
   if( val === '' ) {
      this.el.value = '';
      return;
   }
   var str = "";
   // DATETIME
   if (val instanceof Date) {
      str = this.options.dateFormat.replace('Y',val.getFullYear());
      var m = val.getMonth()+1;
      str = str.replace('m', ((m < 10)? '0':'')+m);
      var d = val.getDate();
      str = str.replace('d', ((d < 10)? '0':'')+d);
   } 
   // else date must match this.options.dateFormat
   else {
     str = val;
   }

   this.el.value = str;
};
   
/**
 * Return value in DATETIME format (use getFormattedValue() to have 04/10/2002-like format)
 */
inputEx.DateField.prototype.getValue = function() {
   // Hack to validate if field not required and empty
   if (this.el.value === '') { return '';}
   var ladate = this.el.value.split("/");
   var formatSplit = this.options.dateFormat.split('/');
   var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
   var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
   var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   return (new Date(Y,m,d));
};
   



// Specific message for the container
inputEx.messages.invalidDate = "Invalid date, ex: 03/27/2008";

/**
 * Register this class as "date" type
 */
inputEx.registerType("date", inputEx.DateField);
/**
 * @class Field that adds the email regexp for validation. Result is always lower case.
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.EmailField = function(options) {
   inputEx.EmailField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.EmailField, inputEx.StringField);

   
/**
 * Set the email regexp and invalid message
 */
inputEx.EmailField.prototype.setOptions = function() {
   inputEx.EmailField.superclass.setOptions.call(this);
   this.options.messages.invalid = inputEx.messages.invalidEmail;
   this.options.regexp = inputEx.regexps.email;
};
   
/**
 * Set the value to lower case since email have no case
 */
inputEx.EmailField.prototype.getValue = function() {
   return this.el.value.toLowerCase();
};
   
// Specific message for the email field
inputEx.messages.invalidEmail = "Invalid email, ex: sample@test.com";

/**
 * Register this class as "email" type
 */
inputEx.registerType("email", inputEx.EmailField);
/**
 * @class Create a hidden input, inherits from inputEx.Field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.HiddenField = function(options) {
	inputEx.HiddenField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.HiddenField, inputEx.Field);
   
/**
 * Doesn't render much...
 */
inputEx.HiddenField.prototype.render = function() {
   this.type = inputEx.HiddenField;
	this.divEl = inputEx.cn('div');
};

/**
 * No events to register
 *
inputEx.HiddenField.prototype.initEvents = function() {};*/

/**
 * Stores the value in a local variable
 */
inputEx.HiddenField.prototype.setValue = function(val) {
   this.value = val;
};

/**
 * Get the previously stored value
 */
inputEx.HiddenField.prototype.getValue = function() {
   return this.value;
};
   
/**
 * Register this class as "hidden" type
 */
inputEx.registerType("hidden", inputEx.HiddenField);/**
 * @class Meta field providing in place editing (the editor appears when you click on the formatted value). Options:
 * - formatDom
 * - formatValue
 * - ou texte...
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.InPlaceEdit = function(options) {
   inputEx.InPlaceEdit.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.InPlaceEdit, inputEx.Field);

/**
 * Override render to create 2 divs: the visualization one, and the edit in place form
 */
inputEx.InPlaceEdit.prototype.render = function() {
      
	// Create a DIV element to wrap the editing el and the image
	this.divEl = inputEx.cn('div', {className: this.options.className});
   	
   this.renderVisuDiv();
	   
	this.renderEditor();
};
   
/**
 * Render the editor
 */
inputEx.InPlaceEdit.prototype.renderEditor = function() {
      
   this.editorContainer = inputEx.cn('div', null, {display: 'none'});
      
   // Render the editor field
   this.editorField = inputEx.buildField(this.options.editorField);
   
   this.editorContainer.appendChild( this.editorField.getEl() );
   YAHOO.util.Dom.setStyle(this.editorField.getEl(), 'float', 'left');
      
   this.okButton = inputEx.cn('input', {type: 'button', value: 'Ok'});
   YAHOO.util.Dom.setStyle(this.okButton, 'float', 'left');
   this.editorContainer.appendChild(this.okButton);
      
   this.cancelLink = inputEx.cn('a', null, null, "cancel");
   this.cancelLink.href = ""; // IE required (here, not in the cn fct)
   YAHOO.util.Dom.setStyle(this.cancelLink, 'float', 'left');
   this.editorContainer.appendChild(this.cancelLink);
      
   // Line breaker
   this.editorContainer.appendChild( inputEx.cn('div',null, {clear: 'both'}) );
      
   this.divEl.appendChild(this.editorContainer);
};
      
inputEx.InPlaceEdit.prototype.onVisuMouseOver = function() {
   if(this.colorAnim) {
      this.colorAnim.stop(true);
   }
   inputEx.sn(this.formattedContainer, null, {backgroundColor: '#eeee33' });
};
   
inputEx.InPlaceEdit.prototype.onVisuMouseOut = function() {
   // Start animation
   if(this.colorAnim) {
      this.colorAnim.stop(true);
   }
   this.colorAnim = new YAHOO.util.ColorAnim(this.formattedContainer, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 1);
   this.colorAnim.onComplete.subscribe(function() { YAHOO.util.Dom.setStyle(this.formattedContainer, 'background-color', ''); }, this, true);
   this.colorAnim.animate();
};
   
/**
 * Create the div that will contain the visualization of the value
 */
inputEx.InPlaceEdit.prototype.renderVisuDiv = function() {
   this.formattedContainer = inputEx.cn('div', {className: 'inputEx-InPlaceEdit-formattedContainer'});
      
   if(typeof this.options.formatDom == "function") {
      this.formattedContainer.appendChild( this.options.formatDom(this.options.value) );
   }
   else if(typeof this.options.formatValue == "function") {
      this.formattedContainer.innerHTML = this.options.formatValue(this.options.value);
   }
   else {
      this.formattedContainer.innerHTML = YAHOO.lang.isUndefined(this.options.value) ? inputEx.messages.emptyInPlaceEdit: this.options.value;
   }
      
   this.divEl.appendChild(this.formattedContainer);
};
   
inputEx.InPlaceEdit.prototype.initEvents = function() {  
   YAHOO.util.Event.addListener(this.formattedContainer, "click", this.openEditor, this, true);
            
   // For color animation
   YAHOO.util.Event.addListener(this.formattedContainer, 'mouseover', this.onVisuMouseOver, this, true);
   YAHOO.util.Event.addListener(this.formattedContainer, 'mouseout', this.onVisuMouseOut, this, true);
         
   // Editor: 
   YAHOO.util.Event.addListener(this.okButton, 'click', this.onOkEditor, this, true);
   YAHOO.util.Event.addListener(this.cancelLink, 'click', this.onCancelEditor, this, true);
         
   if(this.editorField.el) {
      // Register some listeners
      YAHOO.util.Event.addListener(this.editorField.el, "keyup", this.onKeyUp, this, true);
      YAHOO.util.Event.addListener(this.editorField.el, "keydown", this.onKeyDown, this, true);
      // BLur
      YAHOO.util.Event.addListener(this.editorField.el, "blur", this.onCancelEditor, this, true);
   }
};
   
inputEx.InPlaceEdit.prototype.onKeyUp = function(e) {
   // Enter
   if( e.keyCode == 13) {
      this.onOkEditor();
   }
   // Escape
   if( e.keyCode == 27) {
      this.onCancelEditor(e);
   }
};
   
inputEx.InPlaceEdit.prototype.onKeyDown = function(e) {
   // Tab
   if(e.keyCode == 9) {
      this.onOkEditor();
   }
};
   
inputEx.InPlaceEdit.prototype.onOkEditor = function() {
   var newValue = this.editorField.getValue();
   this.setValue(newValue);
      
   this.editorContainer.style.display = 'none';
   this.formattedContainer.style.display = '';
      
   var that = this;
   setTimeout(function() {that.updatedEvt.fire(newValue);}, 50);      
};
   
inputEx.InPlaceEdit.prototype.onCancelEditor = function(e) {
   YAHOO.util.Event.stopEvent(e);
   this.editorContainer.style.display = 'none';
   this.formattedContainer.style.display = '';
};
   
   
inputEx.InPlaceEdit.prototype.openEditor = function() {
   var value = this.getValue();
   this.editorContainer.style.display = '';
   this.formattedContainer.style.display = 'none';
   
   if(!YAHOO.lang.isUndefined(value)) {
      this.editorField.setValue(value);   
   }
      
   // Set focus in the element !
   if(this.editorField.el && typeof this.editorField.el.focus == "function") {
      this.editorField.el.focus();
   }
   
   // Select the content
   if(this.editorField.el && typeof this.editorField.el.setSelectionRange == "function" && (!!value && !!value.length)) {
      this.editorField.el.setSelectionRange(0,value.length);
   }
      
};
   
inputEx.InPlaceEdit.prototype.getValue = function() {
	return this.value;
};


inputEx.InPlaceEdit.prototype.setValue = function(value) {
      
   // Store the value
	this.value = value;
   	
   if(typeof value == "undefined" || value == "") {
      this.value = "(Edit me)";
   }
   	
	// TODO: Display Value only 
   if(typeof this.options.formatDom == "function") {
      this.formattedContainer.innerHTML = "";
      this.formattedContainer.appendChild( this.options.formatDom(this.value) );
   }
   else if(typeof this.options.formatValue == "function") {
      this.formattedContainer.innerHTML = this.options.formatValue(this.value);
   }
   else {
      this.formattedContainer.innerHTML = this.value;
   }
};
  
inputEx.messages.emptyInPlaceEdit = "(click to edit)";

/**
 * Register this class as "inplaceedit" type
 */
inputEx.registerType("inplaceedit", inputEx.InPlaceEdit);

/**
 * @class Adds an IPv4 address regexp
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.IPv4Field = function(options) {
	inputEx.IPv4Field.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IPv4Field, inputEx.StringField);
   
/**
 * set IPv4 regexp and invalid string
 */
inputEx.IPv4Field.prototype.setOptions = function() {
   inputEx.IPv4Field.superclass.setOptions.call(this);
   this.options.messages.invalid = inputEx.messages.invalidIPv4;
   this.options.regexp = inputEx.regexps.ipv4;
};   

// Specific message for the email field
inputEx.messages.invalidIPv4 = "Invalid IPv4 address, ex: 192.168.0.1";

/**
 * Register this class as "IPv4" type
 */
inputEx.registerType("IPv4", inputEx.IPv4Field);
/**
 * @class   Meta field to create a list of other fields
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.ListField = function(options) {
   
   /**
    * List of all the subField instances
    */
   this.subFields = [];
   
   inputEx.ListField.superclass.constructor.call(this, options);
};
YAHOO.extend(inputEx.ListField,inputEx.Field);
   
/**
 * Set the ListField classname
 */
inputEx.ListField.prototype.setOptions = function() {
   inputEx.ListField.superclass.setOptions.call(this);
   this.options.className='inputEx-Field inputEx-ListField';
   this.options.sortable = (typeof this.options.sortable == "undefined") ? false : this.options.sortable;
   
   this.options.elementType = this.options.elementType || {type: 'string'};
   
};
   
/**
 * Render the addButton 
 */
inputEx.ListField.prototype.renderComponent = function() {
      
   // Add element button
   this.addButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-addButton'});
   this.divEl.appendChild(this.addButton);
      
   // List label
   this.divEl.appendChild( inputEx.cn('span', null, {marginLeft: "4px"}, this.options.listLabel) );
      
   // Div element to contain the children
   this.childContainer = inputEx.cn('div', {className: 'inputEx-ListField-childContainer'});
   this.divEl.appendChild(this.childContainer);
};
   
/**
 * Handle the click event on the add button
 */
inputEx.ListField.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.addButton, 'click', this.onAddButton, this, true);
};
   
/**
 * Set the value of all the subfields
 */
inputEx.ListField.prototype.setValue = function(value) {
   
   if(!YAHOO.lang.isArray(value) ) {
      // TODO: throw exceptions ?
      return;
   }
      
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
};
   
/**
 * Return the array of values
 */
inputEx.ListField.prototype.getValue = function() {
   var values = [];
   for(var i = 0 ; i < this.subFields.length ; i++) {
      values[i] = this.subFields[i].getValue();
   }
   return values;
};
   
/**
 * Adds an element
 */
inputEx.ListField.prototype.addElement = function(value) {

   // Render the subField
   var subFieldEl = this.renderSubField(value);
      
   // Adds it to the local list
   this.subFields.push(subFieldEl);
};

/**
 * Add a new element to the list and fire updated event
 * @param {Event} e The original click event
 */
inputEx.ListField.prototype.onAddButton = function(e) {
   YAHOO.util.Event.stopEvent(e);
   
   // Add a field with no value: 
   this.addElement();
   
   // Fire updated !
   this.fireUpdatedEvt();
};
   
/**
 * Adds a new line to the List Field
 * @return  {inputEx.Field} instance of the created field (inputEx.Field or derivative)
 */
inputEx.ListField.prototype.renderSubField = function(value) {
      
   // Div that wraps the deleteButton + the subField
   var newDiv = inputEx.cn('div');
      
   // Delete button
   var delButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-delButton'});
   YAHOO.util.Event.addListener( delButton, 'click', this.onDelete, this, true);
   newDiv.appendChild( delButton );
      
   // Instanciate the new subField
   var opts = YAHOO.lang.merge({}, this.options.elementType);
   if(!opts.inputParams) opts.inputParams = {};
   if(value) opts.inputParams.value = value;
   
   var el = inputEx.buildField(opts);
   
   var subFieldEl = el.getEl();
   YAHOO.util.Dom.setStyle(subFieldEl, 'margin-left', '4px');
   YAHOO.util.Dom.setStyle(subFieldEl, 'float', 'left');
   newDiv.appendChild( subFieldEl );
   
   // Subscribe the onChange event to resend it 
   el.updatedEvt.subscribe(this.onChange, this, true);

   // Arrows to order:
   if(this.options.sortable) {
      var arrowUp = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowUp'});
      YAHOO.util.Event.addListener(arrowUp, 'click', this.onArrowUp, this, true);
      var arrowDown = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowDown'});
      YAHOO.util.Event.addListener(arrowDown, 'click', this.onArrowDown, this, true);
      newDiv.appendChild( arrowUp );
      newDiv.appendChild( arrowDown );
   }

   // Line breaker
   newDiv.appendChild( inputEx.cn('div', null, {clear: "both"}) );

   this.childContainer.appendChild(newDiv);
      
   return el;
};
   
/**
 * Switch a subField with its previous one
 * Called when the user clicked on the up arrow of a sortable list
 * @param {Event} e Original click event
 */
inputEx.ListField.prototype.onArrowUp = function(e) {
   var childElement = YAHOO.util.Event.getTarget(e).parentNode;
   
   var previousChildNode = null;
   var nodeIndex = -1;
   for(var i = 1 ; i < childElement.parentNode.childNodes.length ; i++) {
      var el=childElement.parentNode.childNodes[i];
      if(el == childElement) {
         previousChildNode = childElement.parentNode.childNodes[i-1];
         nodeIndex = i;
         break;
      }
   }
   
   if(previousChildNode) {
      // Remove the line
      var removedEl = this.childContainer.removeChild(childElement);
      
      // Adds it before the previousChildNode
      var insertedEl = this.childContainer.insertBefore(removedEl, previousChildNode);
      
      // Swap this.subFields elements (i,i-1)
      var temp = this.subFields[nodeIndex];
      this.subFields[nodeIndex] = this.subFields[nodeIndex-1];
      this.subFields[nodeIndex-1] = temp;
      
      // Color Animation
      if(this.arrowAnim) {
         this.arrowAnim.stop(true);
      }
      this.arrowAnim = new YAHOO.util.ColorAnim(insertedEl, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 0.4);
      this.arrowAnim.onComplete.subscribe(function() { YAHOO.util.Dom.setStyle(insertedEl, 'background-color', ''); });
      this.arrowAnim.animate();
      
      // Fire updated !
      this.fireUpdatedEvt();
   }
};

/**
 * Switch a subField with its next one
 * Called when the user clicked on the down arrow of a sortable list
 * @param {Event} e Original click event
 */
inputEx.ListField.prototype.onArrowDown = function(e) {
   var childElement = YAHOO.util.Event.getTarget(e).parentNode;
   
   var nodeIndex = -1;
   var nextChildNode = null;
   for(var i = 0 ; i < childElement.parentNode.childNodes.length ; i++) {
      var el=childElement.parentNode.childNodes[i];
      if(el == childElement) {
         nextChildNode = childElement.parentNode.childNodes[i+1];
         nodeIndex = i;
         break;
      }
   }
   
   if(nextChildNode) {
      // Remove the line
      var removedEl = this.childContainer.removeChild(childElement);
      // Adds it after the nextChildNode
      var insertedEl = YAHOO.util.Dom.insertAfter(removedEl, nextChildNode);
      
      // Swap this.subFields elements (i,i+1)
      var temp = this.subFields[nodeIndex];
      this.subFields[nodeIndex] = this.subFields[nodeIndex+1];
      this.subFields[nodeIndex+1] = temp;
      
      // Color Animation
      if(this.arrowAnim) {
         this.arrowAnim.stop(true);
      }
      this.arrowAnim = new YAHOO.util.ColorAnim(insertedEl, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 1);
      this.arrowAnim.onComplete.subscribe(function() { YAHOO.util.Dom.setStyle(insertedEl, 'background-color', ''); });
      this.arrowAnim.animate();
      
      // Fire updated !
      this.fireUpdatedEvt();
   }
};
   
/**
 * Called when the user clicked on a delete button.
 */
inputEx.ListField.prototype.onDelete = function(e, params) {
      
   YAHOO.util.Event.stopEvent(e);
      
   // Get the wrapping div element
   var elementDiv = YAHOO.util.Event.getTarget(e).parentNode;
      
   // Get the index of the subField
   var index = -1;
   
   //console.log(elementDiv);
   
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
      
   this.updatedEvt.fire(this.getValue());
};
   
/**
 * Remove the line from the dom and the subField from the list.
 */
inputEx.ListField.prototype.removeElement = function(index) {
   var elementDiv = this.subFields[index].getEl().parentNode;
      
   this.subFields[index] = undefined;
   this.subFields = this.subFields.compact();
      
   // Remove the element
   elementDiv.parentNode.removeChild(elementDiv);
};

/**
 * Register this class as "list" type
 */
inputEx.registerType("list", inputEx.ListField);

/**
 * @class A meta field to put 2 fields on the same line
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.PairField = function(options) {
   options.leftFieldOptions = options.leftFieldOptions || {};
   options.rightFieldOptions = options.rightFieldOptions || {};
   inputEx.PairField.superclass.constructor.call(this, options);
};

YAHOO.extend( inputEx.PairField, inputEx.Field);


/**
 * float left hack
 */
inputEx.PairField.prototype.render = function() {
   inputEx.PairField.superclass.render.call(this);
   this.divEl.appendChild( inputEx.cn('div', null, {clear: "both"}) );
};
   
/**
 * Render the 2 subfields
 */
inputEx.PairField.prototype.renderComponent = function() {
      
   var leftType = 'string';
   if(this.options.leftFieldOptions.type) { leftType = this.options.leftFieldOptions.type; }
   var leftFieldClass = inputEx.getFieldClass(leftType);
      
   var rightType = 'string';
   if(this.options.rightFieldOptions.type) { rightType = this.options.rightFieldOptions.type; }
   var rightFieldClass = inputEx.getFieldClass(rightType);
   
   this.elLeft = new leftFieldClass(this.options.leftFieldOptions.inputParams || {});
   this.elRight = new rightFieldClass(this.options.rightFieldOptions.inputParams || {});

   YAHOO.util.Dom.setStyle(this.elLeft.getEl(), "float", "left");

   // Append it to the main element
   this.divEl.appendChild(this.elLeft.getEl());
   var span = inputEx.cn('span', null, null, " : ");
   YAHOO.util.Dom.setStyle(span, "float", "left");
   this.divEl.appendChild(span);
   this.divEl.appendChild(this.elRight.getEl());
   	
   YAHOO.util.Dom.setStyle(this.elRight.getEl(), "float", "left");
      
};

/*
inputEx.PairField.prototype.initEvents = function() {
};*/
   
inputEx.PairField.prototype.validate = function() {
   return (this.elLeft.validate() && this.elRight.validate());
};
   
/**
 * Set value
 * @param {Array} val [leftValue, rightValue]
 */
inputEx.PairField.prototype.setValue = function(val) {
   this.elLeft.setValue(val[0]);
   this.elRight.setValue(val[1]);
};

/**
 * Specific getValue 
 * @return {Array} A 2-element array [leftValue, rightValue]
 */   
inputEx.PairField.prototype.getValue = function() {
   return [this.elLeft.getValue(),this.elRight.getValue()];
};

/**
 * Register this class as "pair" type
 */
inputEx.registerType("pair", inputEx.PairField);
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
/**
 * @class Wrapper for the Rich Text Editor from YUI
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.RTEField = function(options) {
   inputEx.RTEField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.RTEField, inputEx.Field);
   
/**
 * Render the field
 */
inputEx.RTEField.prototype.render = function() {
      
   // Create a DIV element to wrap the editing el and the image
   this.divEl = inputEx.cn('div', {className: this.options.className});
      
   if(!inputEx.RTEfieldsNumber) { inputEx.RTEfieldsNumber = 0; }
   var id = "inputEx-RTEField-"+inputEx.RTEfieldsNumber;
      
   this.el = inputEx.cn('textarea', {id: id});
   inputEx.RTEfieldsNumber += 1;
   this.divEl.appendChild(this.el);
      
   this.editor = new YAHOO.widget.Editor(id, {
       height: '300px',
       width: '522px',
       dompath: true
   });
   this.editor.render();
};

inputEx.RTEField.prototype.setValue = function(value) {
   if(this.editor)
      this.editor.setEditorHTML(value);
};


inputEx.RTEField.prototype.getValue = function() {
   try {
      return this.editor.getEditorHTML();
   }
   catch(ex) {}
};

/**
 * Register this class as "html" type
 */
inputEx.registerType("html", inputEx.RTEField);
/**
 * @class Create a select field
 * options:
 *		- selectValues: contains the list of options values
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.SelectField = function(options) {
	inputEx.SelectField.superclass.constructor.call(this,options);
 };
YAHOO.lang.extend(inputEx.SelectField, inputEx.Field);
   
/**
 * Build a select tag with options
 */
inputEx.SelectField.prototype.renderComponent = function() {

   this.el = inputEx.cn('select', {name: this.options.name || ''});
      
   if (this.options.multiple) {this.el.multiple = true; this.el.size = this.options.selectValues.length;}
      
   this.optionEls = [];
   for( var i = 0 ; i < this.options.selectValues.length ; i++) {
      this.optionEls[i] = inputEx.cn('option', {value: this.options.selectValues[i]}, null, (this.options.selectOptions) ? this.options.selectOptions[i] : this.options.selectValues[i]);
      this.el.appendChild(this.optionEls[i]);
   }
   this.divEl.appendChild(this.el);
};   
   
/**
 * Register the "change" event
 */
inputEx.SelectField.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.el,"change", this.onChange, this, true);
};
   
/**
 * Set the value
 */
inputEx.SelectField.prototype.setValue = function(value) {
   var index = 0;
   var option;
   for(var i = 0 ; i < this.options.selectValues.length ; i++) {
      if(value === this.options.selectValues[i]) {
         option = this.el.childNodes[i];
		 option.selected = "selected";
      }
   }
};
   
/**
 * Return the value
 */
inputEx.SelectField.prototype.getValue = function() {
   return this.options.selectValues[this.el.selectedIndex];
};

/**
 * Register this class as "select" type
 */
inputEx.registerType("select", inputEx.SelectField);

/**
 * @class Create a textarea input
 * Added options:
 * <ul>
 *	   <li>rows: rows attribute</li>
 *	   <li>cols: cols attribute</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.Textarea = function(options) {
	inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.Textarea, inputEx.Field);


inputEx.Textarea.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.el, "change", this.onChange, this, true);
};

inputEx.Textarea.prototype.setOptions = function() {
   inputEx.Textarea.superclass.setOptions.call(this);
   this.options.rows = this.options.rows || 6;
   this.options.cols = this.options.cols || 23;
};
   
inputEx.Textarea.prototype.renderComponent = function() {      
   this.el = inputEx.cn('textarea', {
      rows: this.options.rows,
      cols: this.options.cols
   }, null, this.options.value);
      
   this.divEl.appendChild(this.el);
};

inputEx.Textarea.prototype.setValue = function(value) {
   this.el.value = value;
};

inputEx.Textarea.prototype.getValue = function() {
   return this.el.value;
};

/**
 * Register this class as "text" type
 */
inputEx.registerType("text", inputEx.Textarea);
/**
 * @class Create a uneditable field where you can stick the html you want
 * Added Options:
 * <ul>
 *    <li>formatValue: String function(value)</li>
 *    <li>formatDom: DOMEl function(value)</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UneditableField = function(options) {
	inputEx.UneditableField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UneditableField, inputEx.Field);
   
inputEx.UneditableField.prototype.render = function() {
   this.divEl = inputEx.cn('div');
};
   
inputEx.UneditableField.prototype.setValue = function(val) {
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
   
inputEx.UneditableField.prototype.getValue = function() {
   return this.value;
};
   

/**
 * Register this class as "url" type
 */
inputEx.registerType("uneditable", inputEx.UneditableField);/**
 * @class A field where the value is always uppercase
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UpperCaseField = function(options) {
   inputEx.UpperCaseField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UpperCaseField, inputEx.StringField);

inputEx.UpperCaseField.prototype.setValue = function(val) {
      this.el.value = val.toUpperCase();
};

inputEx.UpperCaseField.prototype.onInput = function(e) { 
   	this.setValue( (this.getValue()) );
   	this.setClassFromState();
};

/**
 * @class Adds an url regexp, and display the favicon at this url
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UrlField = function(options) {
   inputEx.UrlField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.UrlField, inputEx.StringField);

/**
 * Adds the invalid Url message
 */
inputEx.UrlField.prototype.setOptions = function() {
   inputEx.UrlField.superclass.setOptions.call(this);
   this.options.className = "inputEx-Field inputEx-UrlField";
   this.options.messages.invalid = inputEx.messages.invalidUrl;
};
   
/**
 * Url are lower case
 */
inputEx.UrlField.prototype.getValue = function() {
   return this.el.value.toLowerCase();
};
   
inputEx.UrlField.prototype.setValue = function(value) {
	this.el.value = value;
	this.validate();
};
   
/**
 * Adds a img tag before the field to display the favicon
 */
inputEx.UrlField.prototype.render = function() {
   inputEx.UrlField.superclass.render.call(this);
   this.el.size = 27;

   // Create the favicon image tag
   this.favicon = inputEx.cn('img');
   this.divEl.insertBefore(this.favicon,this.el);
};
   
/**
 * Validate the field with an url regexp and set the favicon url
 */
inputEx.UrlField.prototype.validate = function() {
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
};
   
// Display the favicon if the icon was found (use of the naturalWidth property)
inputEx.UrlField.prototype.displayFavicon = function() {
   inputEx.sn(this.favicon, null, {visibility: (this.favicon.naturalWidth!=0) ? 'visible' : 'hidden'});
};

inputEx.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";


/**
 * Register this class as "url" type
 */
inputEx.registerType("url", inputEx.UrlField);
