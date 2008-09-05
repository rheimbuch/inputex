(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event;

/**
 * @class Basic string field (equivalent to the input type "text")
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	  <li>regexp: regular expression used to validate (otherwise it always validate)</li>
 *   <li>size: size attribute of the input</li>
 *   <li>maxLength: maximum size of the string field (no message display, uses the maxlength html attribute)</li>
 *   <li>minLength: minimum size of the string field (will display an error message if shorter)</li>
 *   <li>typeInvite: string displayed when the field is empty</li>
 *   <li>readonly: set the field as readonly</li>
 * </ul>
 */
inputEx.StringField = function(options) {
   inputEx.StringField.superclass.constructor.call(this, options);
};

lang.extend(inputEx.StringField, inputEx.Field, 
/**
 * @scope inputEx.StringField.prototype   
 */   
{
   
   /**
    * Add the option "size"
    */
   setOptions: function() {
      inputEx.StringField.superclass.setOptions.call(this);
   },
   
   /**
    * Render an 'INPUT' DOM node
    */
   renderComponent: function() {
      // Attributes of the input field
      var attributes = {};
      attributes.type = 'text';
      if(this.options.size) attributes.size = this.options.size;
      if(this.options.name) attributes.name = this.options.name;
      if(this.options.readonly) attributes.readonly = 'readonly';
      
      if(this.options.maxLength) attributes.maxLength = this.options.maxLength;
   
      // Create the node
      this.el = inputEx.cn('input', attributes);
	
      // Append it to the main element
      this.fieldContainer.appendChild(this.el);
   },
	
   /**
    * Register the change, focus and blur events
    */
   initEvents: function() {	
	   Event.addListener(this.el, "change", this.onChange, this, true);
	   Event.addListener(this.el, "focus", this.onFocus, this, true);
	   Event.addListener(this.el, "blur", this.onBlur, this, true);	  
	   
	   Event.addListener(this.el, "keypress", this.onKeyPress, this, true);
	   Event.addListener(this.el, "keyup", this.onKeyUp, this, true);
   },

   /**
    * Return the string value
    * @param {String} The string value
    */
   getValue: function() {
	   return (this.options.typeInvite && this.el.value == this.options.typeInvite) ? '' : this.el.value;
   },
	
   /**
    * Function to set the value
    * @param {String} value The new value
    */
   setValue: function(value) {
      this.el.value = value;
   },	
	
   /**
    * Uses the optional regexp to validate the field value
    */
   validate: function() { 
      var val = this.getValue();
      // if we are using a regular expression
      if( this.options.regexp ) {
	      return val.match(this.options.regexp);
      }
      if( this.options.minLength ) {
	      return val.length >= this.options.minLength;
      }
      return true;
   },
	
   /**
    * Disable the field
    */
   disable: function() {
      this.el.disabled = true;
   },

   /**
    * Enable the field
    */
   enable: function() {
      this.el.disabled = false;
   },

   /**
    * Set the focus to this field
    */
   focus: function() {
      if(!!this.el && lang.isFunction(this.el.focus) ) {
         this.el.focus();
      }
   },
   
   /**
    * Return (stateEmpty|stateRequired) if the value equals the typeInvite attribute
    */
   getState: function() { 
      var val = this.el.value;//this.getValue();
      // If the field has a minLength:
      if(this.options.minLength && val.length < this.options.minLength) {
         return inputEx.stateInvalid;
      }
	   // if the field is empty :
	   if( val === '' || (this.options.typeInvite && val == this.options.typeInvite) ) {
	      return this.options.required ? inputEx.stateRequired : inputEx.stateEmpty;
	   }
	   return this.validate() ? inputEx.stateValid : inputEx.stateInvalid;
	},
	
	/**
    * Add the minLength string message handling
    */
	getStateString: function(state) {
	   if(state == inputEx.stateInvalid && this.options.minLength && this.el.value.length < this.options.minLength) {  
	      return inputEx.messages.stringTooShort[0]+this.options.minLength+inputEx.messages.stringTooShort[1];
      }
	   return inputEx.StringField.superclass.getStateString.call(this, state);
	},
   
   /**
    * Display the type invite after setting the class
    */
   setClassFromState: function() {
	   inputEx.StringField.superclass.setClassFromState.call(this);
	   if(this.options.typeInvite) {
	      if(this.previousState == inputEx.stateEmpty) {
	         this.el.value = this.options.typeInvite;
	      }
      }
	},
	
	/**
	 * Clear the typeInvite when the field gains focus
	 */
	onFocus: function(e) {
	   inputEx.StringField.superclass.onFocus.call(this,e);
	   if(this.options.typeInvite) {
	      if(this.previousState==inputEx.stateEmpty) {
	         this.el.value = "";
	         
	         // Remove the "empty" state and class
	         this.previousState = null;
	         YAHOO.util.Dom.removeClass(this.divEl,"inputEx-empty");
         }
      }
	},
	
	onKeyPress: function(e) {
	   // override me
	},
   
   onKeyUp: function(e) {
      // Call setClassFromState escaping the stack (after the event has been fully treated, because the value has to be updated)
	   lang.later(0, this, this.setClassFromState);
   }

});


inputEx.messages.stringTooShort = ["This field should contain at least "," numbers or caracters"];

/**
 * Register this class as "string" type
 */
inputEx.registerType("string", inputEx.StringField);

})();
