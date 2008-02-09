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






