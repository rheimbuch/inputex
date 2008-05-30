(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class Meta field to create trees
 * @extends inputEx.ListField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.TreeField = function(options) {
   inputEx.TreeField.superclass.constructor.call(this, options);
};

YAHOO.lang.extend(inputEx.TreeField, inputEx.ListField, 
/**
 * @scope inputEx.TreeField.prototype   
 */   
{

setValue: function(obj) {
   this.subField.setValue(obj.value);
   inputEx.TreeField.superclass.setValue.call(this, obj.childValues);
},

getValue: function() {
   var obj = {
      value: this.subField.getValue(),
      childValues: inputEx.TreeField.superclass.getValue.call(this)
   };
   return obj;
},   


/**
 * Adds a new line to the List Field
 * @return  {inputEx.Field} instance of the created field (inputEx.Field or derivative)
 */
renderSubField: function(value) {
      
   // Div that wraps the deleteButton + the subField
   var newDiv = inputEx.cn('div');
      
   // Delete button
   var delButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-delButton'});
   Event.addListener( delButton, 'click', this.onDelete, this, true);
   newDiv.appendChild( delButton );
      
   var el = new inputEx.TreeField({parentNode: this, elementType: this.options.elementType, value: value });
   var subFieldEl = el.getEl();
   Dom.setStyle(subFieldEl, 'margin-left', '4px');
   Dom.setStyle(subFieldEl, 'float', 'left');
   newDiv.appendChild( subFieldEl );
      
   // Subscribe the onChange event to resend it 
   el.updatedEvt.subscribe(this.onChange, this, true);

   // Line breaker
   newDiv.appendChild( inputEx.cn('div', null, {clear: "both"}) );

   //this.divEl.appendChild(newDiv);
   this.childContainer.appendChild(newDiv);
      
   return el;
},
   
   
/**
 * Render the addButton 
 */
renderComponent: function() {
      
   // Add element button
   this.addButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-addButton'});
   Dom.setStyle(this.addButton, 'float', 'left');
   this.divEl.appendChild(this.addButton);      
      
   // Instanciate the new subField
   this.subField = inputEx.buildField(this.options.elementType);
   
   var subFieldEl = this.subField.getEl();
   Dom.setStyle(subFieldEl, 'margin-left', '4px');
   Dom.setStyle(subFieldEl, 'float', 'left');
   this.divEl.appendChild( subFieldEl );
      
   // Line breaker
   this.divEl.appendChild( inputEx.cn('div', null, {clear: "both"}, this.options.listLabel) );
      
      
   // Div element to contain the children
   this.childContainer = inputEx.cn('div', {className: 'inputEx-ListField-childContainer'});
   this.divEl.appendChild(this.childContainer);      
}

});

/**
 * Register this class as "tree" type
 */
inputEx.registerType("tree", inputEx.TreeField);

})();