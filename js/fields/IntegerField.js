(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event;

/**
 * @class A field limited to number inputs
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	  <li>radix: The radix to be used (default 10)</li>
 * </ul>
 */
inputEx.IntegerField = function(options) {
   inputEx.IntegerField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IntegerField, inputEx.StringField, 
/**
 * @scope inputEx.IntegerField.prototype   
 */
{
   
   /**
    * Add the radix option
    */
   setOptions: function() {
      inputEx.IntegerField.superclass.setOptions.call(this);
      
      this.options.radix = this.options.radix || 10;
   },

   initEvents: function() {	
      inputEx.IntegerField.superclass.initEvents.call(this);

      // The "input" event doesn't exist in IE so we use the "keypress" with a setTimeout to wait until the new value has been set
      //Event.addListener(this.el, "input", this.onInput, this, true);
      var that = this;
      Event.addListener(this.el, "keypress", function(e) { setTimeout(function() { that.onInput(e); },50); });
      
   },

   /**
    * onInput is called 50ms after a "keypress" event
    * @param {Event} e The original input event
    */
   onInput: function(e) {
      try {
	      this.setValue( this.getValue() );
         this.setClassFromState();
      }
      catch(ex) {
         console.log(ex);
      }
   },
   
   /**
    * Set the integer value
    * @param {int} value The value to set
    */
   setValue: function(value) {
      if( isNaN(value) ) {
         this.el.value = "";
      }
      else if( lang.isNumber(value) ) {
         this.el.value = Math.floor(value).toString(this.options.radix);
      }
      else if(lang.isString(value) ) {
        this.el.value = value/*.replace(/[^0-9]/g,'')*/.toString(this.options.radix);
      }
      
   },
   
   /**
    * Get the value
    * @return {int} The integer value
    */
   getValue: function() {
      return parseInt(this.el.value, this.options.radix);
   }

});



/**
 * Register this class as "integer" type
 */
inputEx.registerType("integer", inputEx.IntegerField);

})();