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
      this.ddlist.itemRemovedEvt.subscribe(this.onItemRemoved, this, true);
      this.ddlist.listReorderedEvt.subscribe(this.fireUpdatedEvt, this, true);
   },
   
   /**
    * Re-enable the option element when an item is removed by the user
    */
   onItemRemoved: function(e,params) {
      var itemValue = params[0];
      var index = inputEx.indexOf(itemValue, this.options.selectValues);
      this.el.childNodes[index].disabled = false;
      this.fireUpdatedEvt();
   },
   
   /**
    * Add an item to the list when the select changed
    */
   onAddNewItem: function() {
      if(this.el.selectedIndex != 0) {
         
         // Add the value to the ddlist
         this.ddlist.addItem(this.options.selectValues[this.el.selectedIndex]);
         
         // mark option disabled
         this.el.childNodes[this.el.selectedIndex].disabled = true;
      
         // Return to the first Element
         this.el.selectedIndex = 0;
         
         this.fireUpdatedEvt();
      }
   },
   
   /**
    * Set the value of the list
    * @param {String} value The value to set
    */
   setValue: function(value) {
      
      this.ddlist.setValue(value);
      
      // Re-enable all options
      for(var i = 0 ; i < this.el.childNodes.length ; i++) {
         this.el.childNodes[i].disabled = false;
      }
      // disable selected options
      for(i = 0 ; i < value.length ; i++) {
         var index = inputEx.indexOf(value[i], this.options.selectValues);
         this.el.childNodes[index].disabled = true;
      }
   },
   
   /**
    * Return the value
    * @return {Any} the selected value from the selectValues array
    */
   getValue: function() {
      return this.ddlist.getValue();
   }
   
});

/**
 * Register this class as "multiselect" type
 */
inputEx.registerType("multiselect", inputEx.MultiSelectField);

})();