(function() {
   var inputEx = YAHOO.inputEx, Dom = YAHOO.util.Dom, lang = YAHOO.lang, util = YAHOO.util;

/** 
 * @class An abstract class that contains the shared features for all fields
 * @constructor
 * @param {Object} options Configuration object
 * <ul>
 *	  <li>name: the name of the field</li>
 *	  <li>required: boolean, the field cannot be null if true</li>
 *	  <li>tooltipIcon: show an icon next to the field and display an error in a tooltip (default false)</li>
 *   <li>className: CSS class name for the div wrapper (default 'inputEx-Field')</li>
 *   <li>value: initial value</li>
 *   <li>parentEl: HTMLElement or String id, append the field to this DOM element</li>
 * </ul>
 */
inputEx.Field = function(options) {
	
	/**
	 * Configuration object to set the options for this class and the parent classes. See constructor details for options added by this class.
	 */
	this.options = options || {};
	
	// Set the default values of the options
	this.setOptions();
	
	// Call the render of the dom
	this.render();
	
	// Set the initial value
	if(!lang.isUndefined(this.options.value)) {
		this.setValue(this.options.value);
	}
	
	/**
	 * @event
	 * @param {Any} value The new value of the field
	 * @desc YAHOO custom event fired when the field is "updated"<br /> subscribe with: this.updatedEvt.subscribe(function(e, params) { var value = params[0]; console.log("updated",value, this.updatedEvt); }, this, true);
	 */
	this.updatedEvt = new util.CustomEvent('updated', this);
	
	// initialize behaviour events
	this.initEvents();
	
	// set the default styling
	this.setClassFromState();
	
	// append it immediatly to the parent DOM element
	if(this.options.parentEl) {
	   if( lang.isString(this.options.parentEl) ) {
	     Dom.get(this.options.parentEl).appendChild(this.getEl());  
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
		   Dom.removeClass(this.getEl(), 'inputEx-'+this.previousState );
	   }
	   this.previousState = this.getState();
	   Dom.addClass(this.getEl(), 'inputEx-'+this.previousState );
	
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
    * @param {Event} e The original 'focus' event
    */
	onFocus: function(e) {
	   Dom.addClass(this.getEl(), 'inputEx-focused');
	},

   /**
    * Function called on the blur event
    * @param {Event} e The original 'blur' event
    */
	onBlur: function(e) {
	   Dom.removeClass(this.getEl(), 'inputEx-focused');
	},

   /**
    * onChange event handler
    * @param {Event} e The original 'change' event
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
	},

   /**
    * Focus the field
    */
   focus: function() {
   },
   
   /**
    * Purge all event listeners and remove the component from the dom
    */
   destroy: function() {
      var el = this.getEl();
      
      // Remove from DOM
      if(Dom.inDocument(el)) {
         el.parentEl.removeChild(el);
      }
      
      // recursively purge element
      util.Event.purgeElement(el, true);
   }

};

})();