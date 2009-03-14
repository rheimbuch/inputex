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
   /**
    * Set the default values of the options
    * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
    */
   setOptions: function(options) {
      inputEx.CombineField.superclass.setOptions.call(this, options);
      
      // Overwrite options
      this.options.className = options.className ? options.className : 'inputEx-Field inputEx-CombineField';
      
      // Added options
      this.options.separators = options.separators;
      this.options.fields = options.fields;
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
	   var i, n=this.options.fields.length, f;
	   
	   for(i = 0 ; i < n ; i++) {
	      
	      f = this.options.fields[i];
	      
	      if (this.options.required) {
            f.required = true;
         }
         
	      var field = this.renderField(f);
	      var fieldEl = field.getEl();
	      
	      var t = f.type;
	      if(t != "group" && t != "form") {
	         // remove the line breaker (<div style='clear: both;'>)
	         field.divEl.removeChild(fieldEl.childNodes[fieldEl.childNodes.length-1]);
         }
      	// make the field float left
      	Dom.setStyle(fieldEl, 'float', 'left');
   	   
      	
      	this.fieldContainer.appendChild(fieldEl);
      	
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
      
      // Subfields should inherit required property
      if (this.options.required) {
         if (!fieldOptions.inputParams) {fieldOptions.inputParams = {};}
         fieldOptions.inputParams.required = true;
      }
      
      // Instanciate the field
      var fieldInstance = inputEx(fieldOptions);
      
	   this.inputs.push(fieldInstance);
      
	   // Subscribe to the field "updated" event to send the group "updated" event
      fieldInstance.updatedEvt.subscribe(this.onChange, this, true);
      // Subscribe sub-field "blur" event to trigger class setting at combineField level !
      YAHOO.util.Event.addBlurListener(fieldInstance.getEl(),this.onBlur, this, true);
   	  
      return fieldInstance;
   },

	
	/**
    * Validate each field
    * @returns {Boolean} true if all fields validate and required fields are not empty
    */
   validate: function() {
      // Validate all the sub fields
      var i, n=this.inputs.length;
      for (i = 0 ; i < n; i++) {
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
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(values, sendUpdatedEvt) {
      var i, n=this.inputs.length;
	   for(i = 0 ; i < n ; i++) {
	      this.inputs[i].setValue(values[i], false);
	   }
	   
	   // Call Field.setValue to set class and fire updated event
		inputEx.CombineField.superclass.setValue.call(this,values, sendUpdatedEvt);
	},
	
	/**
	 * Specific getValue 
	 * @return {Array} An array of values [value1, value2, ...]
	 */   
	getValue: function() {
	   var values = [], i, n=this.inputs.length;
	   for(i = 0 ; i < n; i++) {
	      values.push(this.inputs[i].getValue());
	   }
	   return values;
	},
	
	/**
	 * Call setClassFromState on all children
	 */
	setClassFromState: function() {
      var i, n=this.inputs.length;
      
	   inputEx.CombineField.superclass.setClassFromState.call(this);
	   
	   for(i = 0 ; i < n ; i++) {
	      this.inputs[i].setClassFromState();
	   }
	},
	
	/**
	 * Clear all subfields
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this clear should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	clear: function(sendUpdatedEvt) {
      var i, n=this.inputs.length;
	   for(i = 0 ; i < n ; i++) {
	      this.inputs[i].clear(false);
	   }
	   
	   // must reset field style explicitly
	   //  -> case different from Field.prototype.clear (which calls setValue, which calls setClassFromState)
	   this.setClassFromState();
	   
	   if(sendUpdatedEvt !== false) {
	      // fire update event
         this.fireUpdatedEvt();
      }
	},
   
   /**
    * Useful for getState to return correct state (required, empty, etc...)
    */
   isEmpty: function() {
      var i, n=this.inputs.length;
      for(i = 0 ; i < n ; i++) {
	      if (!this.inputs[i].isEmpty()) return false;
	   }
	   return true;
   }
	
});
	
/**
 * Register this class as "combine" type
 */
inputEx.registerType("combine", inputEx.CombineField);
	
})();