/**
 * @class Create a checkbox. Here are the added options :
 * <ul>
 *    <li>checked: boolean, initial state</li>
 *    <li>sentValues: couple of values that schould be returned by the getValue. (default: [true, false])</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.CheckBox = function(options) {
	inputEx.CheckBox.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.CheckBox, inputEx.Field);
   
/**
 * Adds the CheckBox specific options
 */
inputEx.CheckBox.prototype.setOptions = function() {
   inputEx.CheckBox.superclass.setOptions.call(this);
   
   this.sentValues = this.options.sentValues || [true, false];
   this.checkedValue = this.sentValues[0];
   this.uncheckedValue = this.sentValues[1];
};
   
/**
 * Render the checkbox and the hidden field
 */
inputEx.CheckBox.prototype.renderComponent = function() {

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
};
   
/**
 * Clear the previous events and listen for the "change" event
 */
inputEx.CheckBox.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.el, "change", this.onChange, this, true);	
};
   
/**
 * Function called when the checkbox is toggled
 */
inputEx.CheckBox.prototype.onChange = function(e) {
   this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
   
   inputEx.CheckBox.superclass.onChange.call(this,e);
};

/**
 * @return {Any} one of [checkedValue,uncheckedValue]
 */
inputEx.CheckBox.prototype.getValue = function() {
      return this.el.checked ? this.checkedValue : this.uncheckedValue;
};

/**
 * Set the value of the checkedbox
 * @param {Any} value The value schould be one of [checkedValue,uncheckedValue]
 * TODO: Throw an exception otherwise ?
 */
inputEx.CheckBox.prototype.setValue = function(value) {
   if (value===this.checkedValue) {
		this.hiddenEl.value = value;
		this.el.checked = true;
	}
   else if (value===this.uncheckedValue) {
		this.hiddenEl.value = value;
		this.el.checked = false;
	}
};
   

/**
 * Register this class as "boolean" type
 */
inputEx.registerType("boolean", inputEx.CheckBox);
