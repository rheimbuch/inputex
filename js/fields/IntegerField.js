(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event;

/**
 * @class A field limited to number inputs
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.IntegerField = function(options) {
   inputEx.IntegerField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.IntegerField, inputEx.StringField, 
/**
 * @scope inputEx.IntegerField.prototype   
 */
{

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
	   this.setValue( this.getValue() );
      this.setClassFromState();
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
         this.el.value = Math.floor(value);
      }
      else if(lang.isString(value) ) {
        this.el.value = value.replace(/[^0-9]/g,'');
      }
      
   },
   
   /**
    * Get the value
    * @return {int} The integer value
    */
   getValue: function() {
      return parseInt(this.el.value, 10);
   }

});



/**
 * Register this class as "integer" type
 */
inputEx.registerType("integer", inputEx.IntegerField);

})();