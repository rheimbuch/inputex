(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Create a select field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *	   <li>selectValues: contains the list of options values</li>
 *	   <li>selectOptions: list of option element texts</li>
 *    <li>multiple: boolean to allow multiple selections</li>
 * </ul>
 */
inputEx.MultiSelectField = function(options) {
	inputEx.MultiSelectField.superclass.constructor.call(this,options);
 };
YAHOO.lang.extend(inputEx.MultiSelectField, inputEx.SelectField, 
/**
 * @scope inputEx.MultiSelectField.prototype   
 */   
{
   
   /**
    * Build the DDList
    */
   renderComponent: function() {
      inputEx.MultiSelectField.superclass.renderComponent.call(this);
      
      this.ddlist = new inputEx.widget.DDList({parentEl: this.fieldContainer});
   },  
   
   /**
    * Register the "change" event
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.el,"change", this.onAddNewItem, this, true);
   },
   
   onAddNewItem: function() {
      // TODO: mark option disabled
      this.ddlist.addItem(this.options.selectValues[this.el.selectedIndex]);
   },
   
   /**
    * Set the value
    * @param {String} value The value to set
    */
   setValue: function(value) {
      // TODO: mark the option disabled
      this.ddlist.setValue(value);
   },
   
   /**
    * Return the value
    * @return {Any} the selected value from the selectValues array
    */
   getValue: function() {
      return this.ddlist.getValue();
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
   }
   
});

/**
 * Register this class as "multiselect" type
 */
inputEx.registerType("multiselect", inputEx.MultiSelectField);

})();