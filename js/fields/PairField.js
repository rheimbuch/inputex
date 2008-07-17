(function() {
	
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Dom = YAHOO.util.Dom;
	
/**
 * @class A meta field to put 2 fields on the same line
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *    <li>leftFieldOptions: the left field type definition object (same as groups)</li>
 *    <li>rightFieldOptions: the right field type definition object (same as groups)</li>
 * </ul>
 */
inputEx.PairField = function(options) {
   options.leftFieldOptions = options.leftFieldOptions || {};
   options.rightFieldOptions = options.rightFieldOptions || {};
   inputEx.PairField.superclass.constructor.call(this, options);
};
	
lang.extend( inputEx.PairField, inputEx.Field, 
/**
 * @scope inputEx.PairField.prototype   
 */   
{
	
	/**
	 * Insert a breaker (div with clear:both css attribute)
	 */
	render: function() {
	   inputEx.PairField.superclass.render.call(this);
	   this.divEl.appendChild( inputEx.cn('div', null, {clear: "both"}) );
	},
	   
	/**
	 * Render the two subfields
	 */
	renderComponent: function() {
	      
	   var leftType = 'string';
	   if(this.options.leftFieldOptions.type) { leftType = this.options.leftFieldOptions.type; }
	   var leftFieldClass = inputEx.getFieldClass(leftType);
	      
	   var rightType = 'string';
	   if(this.options.rightFieldOptions.type) { rightType = this.options.rightFieldOptions.type; }
	   var rightFieldClass = inputEx.getFieldClass(rightType);
	   
	   this.elLeft = new leftFieldClass(this.options.leftFieldOptions.inputParams || {});
	   this.elRight = new rightFieldClass(this.options.rightFieldOptions.inputParams || {});
	
	   Dom.setStyle(this.elLeft.getEl(), "float", "left");
	
	   // Append it to the main element
	   this.divEl.appendChild(this.elLeft.getEl());
	   var span = inputEx.cn('span', null, null, " : ");
	   Dom.setStyle(span, "float", "left");
	   this.divEl.appendChild(span);
	   this.divEl.appendChild(this.elRight.getEl());
	   	
	   Dom.setStyle(this.elRight.getEl(), "float", "left");
	      
	},
	
	/**
	 * Apply a AND operator on both field validations
	 */
	validate: function() {
	   return (this.elLeft.validate() && this.elRight.validate());
	},
	   
	/**
	 * Set the value
	 * @param {Array} val [leftValue, rightValue]
	 */
	setValue: function(val) {
	   this.elLeft.setValue(val[0]);
	   this.elRight.setValue(val[1]);
	},
	
	/**
	 * Specific getValue 
	 * @return {Array} A 2-element array [leftValue, rightValue]
	 */   
	getValue: function() {
	   return [this.elLeft.getValue(),this.elRight.getValue()];
	}
	
});
	
/**
 * Register this class as "pair" type
 */
inputEx.registerType("pair", inputEx.PairField);
	
})();