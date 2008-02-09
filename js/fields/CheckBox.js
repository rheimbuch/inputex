/**
 * Create a <checkbox> input. Here are the added options :
 * <ul>
 *    <li>checked: boolean, initial state</li>
 *    <li>sentValues: couple of values that schould be returned by the getValue. (default: [true, false])</li>
 * </ul>
 *
 * @class inputEx.CheckBox
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.CheckBox = function(options) {
	inputEx.CheckBox.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.CheckBox, inputEx.Field, {
   
   /**
    * Adds the CheckBox specific options
    */
   setOptions: function() {
      inputEx.CheckBox.superclass.setOptions.call(this);
      
      this.sentValues = this.options.sentValues || [true, false];
      this.checkedValue = this.sentValues[0];
      this.uncheckedValue = this.sentValues[1];
   },
   
   /**
    * Render the checkbox and the hidden field
    */
   renderComponent: function() {
      this.el = inputEx.cn('input', {
           type: 'checkbox', 
           checked:(this.options.checked === false) ? false : true 
      });
      this.divEl.appendChild(this.el);

      this.label = inputEx.cn('label', {className: 'inputExForm-checkbox-rightLabel'}, null, this.options.label || '');
      this.divEl.appendChild(this.label);

      // Keep state of checkbox in a hidden field (format : this.checkedValue or this.uncheckedValue)
      this.hiddenEl = inputEx.cn('input', {type: 'hidden', name: this.options.name || '', value: this.el.checked ? this.checkedValue : this.uncheckedValue});
      this.divEl.appendChild(this.hiddenEl);
   },
   
   /**
    * Clear the previous events and listen for the "change" event
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.el, "change", this.toggleHiddenEl, this, true);	
   },
   
   /**
    * Function called when the checkbox is toggled
    */
   toggleHiddenEl: function() {
      this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
   },
   
   getValue: function() {
      return this.el.checked ? this.checkedValue : this.uncheckedValue;
   },
   
   setValue: function(value) {
       if (value===this.checkedValue) {
   		this.hiddenEl.value = value;
   		this.el.checked = true;
   	}
       else if (value===this.uncheckedValue) {
   		this.hiddenEl.value = value;
   		this.el.checked = false;
   	}
   	else {
   	    throw "Wrong value assignment in checkBox input";
   	}
   }
   
});


/**
 * Register this class as "boolean" type
 */
inputEx.registerType("boolean", inputEx.CheckBox);
