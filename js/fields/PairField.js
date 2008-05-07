/**
 * @class A meta field to put 2 fields on the same line
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.PairField = function(options) {
   options.leftFieldOptions = options.leftFieldOptions || {};
   options.rightFieldOptions = options.rightFieldOptions || {};
   inputEx.PairField.superclass.constructor.call(this, options);
};

YAHOO.extend( inputEx.PairField, inputEx.Field);


/**
 * float left hack
 */
inputEx.PairField.prototype.render = function() {
   inputEx.PairField.superclass.render.call(this);
   this.divEl.appendChild( inputEx.cn('div', null, {clear: "both"}) );
};
   
/**
 * Render the 2 subfields
 */
inputEx.PairField.prototype.renderComponent = function() {
      
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
   	
   YAHOO.util.Dom.setStyle(this.elRight.getEl(), "float", "left");
      
};

/*
inputEx.PairField.prototype.initEvents = function() {
};*/
   
inputEx.PairField.prototype.validate = function() {
   return (this.elLeft.validate() && this.elRight.validate());
};
   
/**
 * Set value
 * @param {Array} val [leftValue, rightValue]
 */
inputEx.PairField.prototype.setValue = function(val) {
   this.elLeft.setValue(val[0]);
   this.elRight.setValue(val[1]);
};

/**
 * Specific getValue 
 * @return {Array} A 2-element array [leftValue, rightValue]
 */   
inputEx.PairField.prototype.getValue = function() {
   return [this.elLeft.getValue(),this.elRight.getValue()];
};

/**
 * Register this class as "pair" type
 */
inputEx.registerType("pair", inputEx.PairField);
