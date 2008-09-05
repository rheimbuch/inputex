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
inputEx.MultiAutoComplete = function(options) {
	inputEx.MultiAutoComplete.superclass.constructor.call(this,options);
 };
YAHOO.lang.extend(inputEx.MultiAutoComplete, inputEx.AutoComplete, 
/**
 * @scope inputEx.MultiAutoComplete.prototype   
 */   
{
   
   /**
    * Build the DDList
    */
   renderComponent: function() {
      inputEx.MultiAutoComplete.superclass.renderComponent.call(this);
      
      this.ddlist = new inputEx.widget.DDList({parentEl: this.fieldContainer});
      this.ddlist.itemRemovedEvt.subscribe(function() {
         this.fireUpdatedEvt();
      }, this, true);
   },  
   
   validateItem: function() {
       var pos = -1;
       for(var i = 0 ; i < this.listEl.childNodes.length ; i++) {
          if(this.listEl.childNodes[i]==this.highlightedItem) {
             pos = i;
             break;
          }
       }
       if(pos == -1) { return; }
   
       this.el.value = "";
       this.ddlist.addItem( this.options.displayAutocompleted.call(this, this.listValues[pos]) );
       
       this.hideList();
       
       // Fire the validateItem event
       this.validateItemEvt.fire(this.listValues[pos]);
    },
   
   /**
    * Set the value
    * @param {String} value The value to set
    */
   setValue: function(value) {
      this.ddlist.setValue(value);
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
 * Register this class as "multiautocomplete" type
 */
inputEx.registerType("multiautocomplete", inputEx.MultiAutoComplete);

})();