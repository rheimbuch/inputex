(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class An autocomplete module
 * @constructor
 * @extends inputEx.StringField
 * @param {Object} options Added options for Autocompleter
 * <ul>
 *	  <li>datasource: the datasource</li>
 *	  <li>autoComp: autocompleter options</li>
 *   <li>returnValue: function to format the returned value (optional)</li>
 * </ul>
 */
inputEx.AutoComplete = function(options) {
   inputEx.AutoComplete.superclass.constructor.call(this, options);
};

lang.extend(inputEx.AutoComplete, inputEx.StringField, 
/**
 * @scope inputEx.AutoComplete.prototype   
 */   
{

   /**
    * Adds autocomplete options
    */
   setOptions: function() {
      this.options.className = this.options.className || 'inputEx-Field inputEx-AutoComplete';
      inputEx.AutoComplete.superclass.setOptions.call(this);
   },

   /**
    * Render the hidden list element
    */
   renderComponent: function() {
   
      // This element wraps the input node in a float: none div
      this.wrapEl = inputEx.cn('div', {className: 'inputEx-StringField-wrapper'});
      
      // Attributes of the input field
      var attributes = {
         type: 'text',
         id: YAHOO.util.Dom.generateId()
      };
      if(this.options.size) attributes.size = this.options.size;
      if(this.options.readonly) attributes.readonly = 'readonly';
      if(this.options.maxLength) attributes.maxLength = this.options.maxLength;
   
      // Create the node
      this.el = inputEx.cn('input', attributes);
      
      // Create the hidden input
      var hiddenAttrs = {
         type: 'hidden',
         value: ''
      };
      if(this.options.name) hiddenAttrs.name = this.options.name;
      this.hiddenEl = inputEx.cn('input', hiddenAttrs);
      
      // Append it to the main element
      this.wrapEl.appendChild(this.el);
      this.wrapEl.appendChild(this.hiddenEl);
      this.fieldContainer.appendChild(this.wrapEl);
   
      // Render the list :
      this.listEl = inputEx.cn('div', {id: Dom.generateId() });
      this.fieldContainer.appendChild(this.listEl);
       
      Event.onAvailable([this.el, this.listEl], this.buildAutocomplete, this, true);
   },
   
   buildAutocomplete: function() {
      // Call this function only when this.el AND this.listEl are available
      if(!this._nElementsReady) { this._nElementsReady = 0; }
      this._nElementsReady++;
      if(this._nElementsReady != 2) return;
      
      // Instantiate AutoComplete
      this.oAutoComp = new YAHOO.widget.AutoComplete(this.el.id, this.listEl.id, this.options.datasource, this.options.autoComp);

      // subscribe to the itemSelect event
      this.oAutoComp.itemSelectEvent.subscribe(this.itemSelectHandler, this, true);
      
   },
   
   //define your itemSelect handler function:
   itemSelectHandler: function(sType, aArgs) {
   	var aData = aArgs[2];
   	this.setValue( this.options.returnValue ? this.options.returnValue(aData) : aData[0] );
   	
   	this.fireUpdatedEvt();
   },
   
   /**
    * onChange event handler
    * @param {Event} e The original 'change' event
    */
	onChange: function(e) {
	   this.setClassFromState();
	   // Clear the field when no value 
      YAHOO.lang.later(50, this, function() {
         if(this.el.value == "") {
            this.setValue("");
            this.fireUpdatedEvt();
         }
      });
	},
   
   setValue: function(value) {
      this.hiddenEl.value = value;
   },
   
   getValue: function() {
      return this.hiddenEl.value;
   }

});


/**
* Register this class as "autocomplete" type
*/
inputEx.registerType("autocomplete", inputEx.AutoComplete);

})();
