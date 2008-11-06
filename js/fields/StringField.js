(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

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
    * Render an 'INPUT' DOM node
    */
   renderComponent: function() {
      
      // This element wraps the input node in a float: none div
      this.wrapEl = inputEx.cn('div', {className: 'inputEx-StringField-wrapper'});
      
      // Attributes of the input field
      var attributes = {};
      attributes.type = 'text';
      attributes.id = YAHOO.util.Dom.generateId();
      if(this.options.size) attributes.size = this.options.size;
      if(this.options.name) attributes.name = this.options.name;
      if(this.options.readonly) attributes.readonly = 'readonly';
      
      if(this.options.maxLength) attributes.maxLength = this.options.maxLength;
   
      // Create the node
      this.el = inputEx.cn('input', attributes);
	
      // Append it to the main element
      this.wrapEl.appendChild(this.el);
      this.fieldContainer.appendChild(this.wrapEl);
   },
	
   /**
    * Register the change, focus and blur events
    */
   initEvents: function() {	
	   Event.addListener(this.el, "change", this.onChange, this, true);
	   Event.addFocusListener(this.el, this.onFocus, this, true);
	   Event.addBlurListener(this.el, this.onBlur, this, true);	  
	   
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
    * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
    */
   setValue: function(value, sendUpdatedEvt) {
      this.el.value = value;
      
      // call parent class method to set style and fire updatedEvt
      inputEx.StringField.superclass.setValue.call(this, value, sendUpdatedEvt);
   },	
	
   /**
    * Uses the optional regexp to validate the field value
    */
   validate: function() { 
      var val = this.getValue();
      
      // no validation on non-required empty field
      if (val == '') {
         return true;
      }
      
      // Check regex matching and minLength (both used in password field...)
      var result = true;
      
      // if we are using a regular expression
      if( this.options.regexp ) {
	      result = result && val.match(this.options.regexp);
      }
      if( this.options.minLength ) {
	      result = result && val.length >= this.options.minLength;
      }
      return result;
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
    * Return (stateEmpty|stateRequired) 
    */
   getState: function() { 
      var val = this.getValue();
      
	   // if the field is empty :
	   if( val === '') {
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

	   // display/mask typeInvite
	   if(this.options.typeInvite) {
	      if (!Dom.hasClass(this.divEl, "inputEx-focused")) {
	         if(this.previousState == inputEx.stateEmpty || this.previousState == inputEx.stateRequired) {
   	         Dom.addClass(this.divEl, "inputEx-typeInvite");
   	         this.el.value = this.options.typeInvite;
            } else { // important for setValue to work with typeInvite
               Dom.removeClass(this.divEl, "inputEx-typeInvite");
            }
	      }
      }
	},
	
	/**
	 * Clear the typeInvite when the field gains focus
	 */
	onFocus: function(e) {
	   inputEx.StringField.superclass.onFocus.call(this,e);
	   if(this.options.typeInvite) {
	      if(Dom.hasClass(this.divEl,"inputEx-typeInvite")) {
	         this.el.value = "";
	         
	         // Remove the "empty" state and class
	         this.previousState = null;
	         Dom.removeClass(this.divEl,"inputEx-typeInvite");
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
