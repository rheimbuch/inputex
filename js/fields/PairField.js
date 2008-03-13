

inputEx.PairField = function(options) {
   
   options.leftFieldOptions = options.leftFieldOptions || {};
   options.rightFieldOptions = options.rightFieldOptions || {};
   inputEx.PairField.superclass.constructor.call(this, options);
   
};

YAHOO.extend( inputEx.PairField, inputEx.Field, {
   
   renderComponent: function() {
      
      var leftType = 'string';
      if(this.options.leftFieldOptions.type) { leftType = this.options.leftFieldOptions.type; }
      var leftFieldClass = inputEx.getFieldClass(leftType);
      
      var rightType = 'string';
      if(this.options.rightFieldOptions.type) { rightType = this.options.rightFieldOptions.type; }
      var rightFieldClass = inputEx.getFieldClass(rightType);
      
   	this.elLeft = new leftFieldClass(this.options.leftFieldOptions.inputParams || {});
   	this.elRight = new rightFieldClass(this.options.rightFieldOptions.inputParams || {});

      YAHOO.util.Dom.setStyle(this.elLeft.getEl(), "float", "left");

   	// Append it to the main element
   	this.divEl.appendChild(this.elLeft.getEl());
   	var span = inputEx.cn('span', null, null, " : ");
      YAHOO.util.Dom.setStyle(span, "float", "left");
   	this.divEl.appendChild(span);
   	this.divEl.appendChild(this.elRight.getEl());
   },
   
   initEvents: function() {
      
   },
   
   validate: function() {
      return (this.elLeft.validate() && this.elRight.validate());
   },
   
   setValue: function(val) {
      this.elLeft.setValue(val[0]);
      this.elRight.setValue(val[1]);
   },
   
   getValue: function() {
      return [this.elLeft.getValue(),this.elRight.getValue()];
   }
   
});


/**
 * Register this class as "pair" type
 */
inputEx.registerType("pair", inputEx.PairField);
