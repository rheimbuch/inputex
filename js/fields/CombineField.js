(function() {
	
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Dom = YAHOO.util.Dom;
	
/**
 * @class A meta field to put N fields on the same line, separated by separators
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>separators: array of string inserted</li>
 *    <li>fields: list of fields in inputEx-typed-JSON</li>
 * </ul>
 */
inputEx.CombineField = function(options) {
   inputEx.CombineField.superclass.constructor.call(this, options);
};
	
lang.extend( inputEx.CombineField, inputEx.Field, 
/**
 * @scope inputEx.CombineField.prototype   
 */   
{
   setOptions: function() {
      this.options.className = this.options.className || 'inputEx-Field inputEx-CombineField';
      inputEx.CombineField.superclass.setOptions.call(this);
   },
	   
	/**
	 * Render the two subfields
	 */
	renderComponent: function() {
	    
	   this.inputs = [];
	   
	   this.appendSeparator(0);
	   
	   if(!this.options.fields) {
	      return;
	   }
	   
	   for(var i = 0 ; i < this.options.fields.length ; i++) {
	      
	      var field = this.renderField(this.options.fields[i]);
	      // remove the line breaker (<div style='clear: both;'>)
	      field.divEl.removeChild(field.divEl.childNodes[field.divEl.childNodes.length-1]);
      	// make the field float left
      	YAHOO.util.Dom.setStyle(field.getEl(), 'float', 'left');
      	this.fieldContainer.appendChild(field.getEl());
      	
      	this.appendSeparator(i+1);
	   }
	      
	},
	
	appendSeparator: function(i) {
	   if(this.options.separators && this.options.separators[i]) {
	      var sep = inputEx.cn('div', {className: 'inputEx-CombineField-separator'}, null, this.options.separators[i]);
	      this.fieldContainer.appendChild(sep);
      }
	},
	
	/**
    * Instanciate one field given its parameters, type or fieldClass
    * @param {Object} fieldOptions The field properties as required bu inputEx.buildField
    */
   renderField: function(fieldOptions) {

      // Instanciate the field
      var fieldInstance = inputEx.buildField(fieldOptions);      
      
	   this.inputs.push(fieldInstance);
      
	   // Subscribe to the field "updated" event to send the group "updated" event
      fieldInstance.updatedEvt.subscribe(this.onChange, this, true);
   	  
      return fieldInstance;
   },

	
	/**
    * Validate each field
    * @returns {Boolean} true if all fields validate and required fields are not empty
    */
   validate: function() {
      // Validate all the sub fields
      for (var i = 0 ; i < this.inputs.length ; i++) {
   	   var input = this.inputs[i];
   	   var state = input.getState();
   	   if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
   		   return false;
   	   }
      }
      return true;
   },
	   
	/**
	 * Set the value
	 * @param {Array} values [value1, value2, ...]
	 */
	setValue: function(values) {
	   for(var i = 0 ; i < this.inputs.length ; i++) {
	      this.inputs[i].setValue(values[i]);
	   }
	   
	   // Call Field.setValue to set class and fire updated event
		inputEx.CombineField.superclass.setValue.call(this,values);
	},
	
	/**
	 * Specific getValue 
	 * @return {Array} An array of values [value1, value2, ...]
	 */   
	getValue: function() {
	   var values = [];
	   for(var i = 0 ; i < this.inputs.length ; i++) {
	      values.push(this.inputs[i].getValue());
	   }
	   return values;
	},
	
	/**
	 * Call setClassFromState on all children
	 */
	setClassFromState: function() {
	   inputEx.CombineField.superclass.setClassFromState.call(this);
	   
	   for(var i = 0 ; i < this.inputs.length ; i++) {
	      this.inputs[i].setClassFromState();
	   }
	},
	
	/**
	 * Clear
	 */
	clear: function() {
	   for(var i = 0 ; i < this.inputs.length ; i++) {
	      this.inputs[i].clear();
	   }
	}
	
});
	
/**
 * Register this class as "combine" type
 */
inputEx.registerType("combine", inputEx.CombineField);
	
})();