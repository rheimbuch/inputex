(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Create a textarea input
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>rows: rows attribute</li>
 *	   <li>cols: cols attribute</li>
 * </ul>
 */
inputEx.Textarea = function(options) {
	inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.Textarea, inputEx.Field, 
/**
 * @scope inputEx.Textarea.prototype   
 */   
{
   /**
    * Register the change event
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.el, "change", this.onChange, this, true);
   },
   
   /**
    * Set the specific options (rows and cols)
    */
   setOptions: function() {
      inputEx.Textarea.superclass.setOptions.call(this);
      this.options.rows = this.options.rows || 6;
      this.options.cols = this.options.cols || 23;
   },
      
   /**
    * Render a textarea node
    */
   renderComponent: function() {      
      this.el = inputEx.cn('textarea', {
         rows: this.options.rows,
         cols: this.options.cols
      }, null, this.options.value);
      
      this.divEl.appendChild(this.el);
   },

   /**
    * Set the value
    * @param {String} value value to set
    */
   setValue: function(value) {
      this.el.value = value;
   },

   /**
    * Return the value
    * @return {String} The value
    */
   getValue: function() {
      return this.el.value;
   }

});

/**
 * Register this class as "text" type
 */
inputEx.registerType("text", inputEx.Textarea);

})();