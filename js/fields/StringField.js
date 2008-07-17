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
      
      // Field Size
      this.options.size = this.options.size || 20;
   },
   
   /**
    * Render an 'INPUT' DOM node
    */
   renderComponent: function() {
      // Attributes of the input field
      var attributes = {};
      attributes.type = 'text';
      attributes.size = this.options.size;
      if(this.options.name) attributes.name = this.options.name;
   
      // Create the node
      this.el = inputEx.cn('input', attributes);
	
      // Append it to the main element
      this.divEl.appendChild(this.el);
   },
	
   /**
    * Register the change, focus and blur events
    */
   initEvents: function() {	
	   Event.addListener(this.el, "change", this.onChange, this, true);
	   Event.addListener(this.el, "focus", this.onFocus, this, true);
	   Event.addListener(this.el, "blur", this.onBlur, this, true);	  
   },

   /**
    * Return the string value
    * @param {String} The string value
    */
   getValue: function() { 
	   return this.el.value;
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
      // if we are using a regular expression
      if( this.options.regexp ) {
	      return this.getValue().match(this.options.regexp);
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
   }

});

/**
 * Register this class as "string" type
 */
inputEx.registerType("string", inputEx.StringField);

})();
