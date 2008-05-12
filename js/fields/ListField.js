/**
 * @class   Meta field to create a list of other fields
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.ListField = function(options) {
   
   /**
    * List of all the subField instances
    */
   this.subFields = [];
   
   inputEx.ListField.superclass.constructor.call(this, options);
};
YAHOO.extend(inputEx.ListField,inputEx.Field);
   
/**
 * Set the ListField classname
 */
inputEx.ListField.prototype.setOptions = function() {
   inputEx.ListField.superclass.setOptions.call(this);
   this.options.className='inputEx-Field inputEx-ListField';
   this.options.sortable = YAHOO.lang.isUndefined(this.options.sortable) ? false : this.options.sortable;
   
   this.options.elementType = this.options.elementType || {type: 'string'};
   
};
   
/**
 * Render the addButton 
 */
inputEx.ListField.prototype.renderComponent = function() {
      
   // Add element button
   this.addButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-addButton'});
   this.divEl.appendChild(this.addButton);
      
   // List label
   this.divEl.appendChild( inputEx.cn('span', null, {marginLeft: "4px"}, this.options.listLabel) );
      
   // Div element to contain the children
   this.childContainer = inputEx.cn('div', {className: 'inputEx-ListField-childContainer'});
   this.divEl.appendChild(this.childContainer);
};
   
/**
 * Handle the click event on the add button
 */
inputEx.ListField.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.addButton, 'click', this.onAddButton, this, true);
};
   
/**
 * Set the value of all the subfields
 */
inputEx.ListField.prototype.setValue = function(value) {
   
   if(!YAHOO.lang.isArray(value) ) {
      // TODO: throw exceptions ?
      return;
   }
      
   // Set the values (and add the lines if necessary)
   for(var i = 0 ; i < value.length ; i++) {
      if(i == this.subFields.length) {
         this.addElement(value[i]);
      }
      else {
         this.subFields[i].setValue(value[i]);
      }
   }
      
   // Remove additional subFields
   var additionalElements = this.subFields.length-value.length;
   if(additionalElements > 0) {
      for(var i = 0 ; i < additionalElements ; i++) { 
         this.removeElement(value.length);
      }
   }
};
   
/**
 * Return the array of values
 */
inputEx.ListField.prototype.getValue = function() {
   var values = [];
   for(var i = 0 ; i < this.subFields.length ; i++) {
      values[i] = this.subFields[i].getValue();
   }
   return values;
};
   
/**
 * Adds an element
 * @return {inputEx.Field} SubField added instance
 */
inputEx.ListField.prototype.addElement = function(value) {

   // Render the subField
   var subFieldEl = this.renderSubField(value);
      
   // Adds it to the local list
   this.subFields.push(subFieldEl);
   
   return subFieldEl;
};

/**
 * Add a new element to the list and fire updated event
 * @param {Event} e The original click event
 */
inputEx.ListField.prototype.onAddButton = function(e) {
   YAHOO.util.Event.stopEvent(e);
   
   // Add a field with no value: 
   var subFieldEl = this.addElement();
   
   // Focus on this field
   subFieldEl.focus();
   
   // Fire updated !
   this.fireUpdatedEvt();
};
   
/**
 * Adds a new line to the List Field
 * @return  {inputEx.Field} instance of the created field (inputEx.Field or derivative)
 */
inputEx.ListField.prototype.renderSubField = function(value) {
      
   // Div that wraps the deleteButton + the subField
   var newDiv = inputEx.cn('div');
      
   // Delete button
   var delButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-delButton'});
   YAHOO.util.Event.addListener( delButton, 'click', this.onDelete, this, true);
   newDiv.appendChild( delButton );
      
   // Instanciate the new subField
   var opts = YAHOO.lang.merge({}, this.options.elementType);
   if(!opts.inputParams) opts.inputParams = {};
   if(value) opts.inputParams.value = value;
   
   var el = inputEx.buildField(opts);
   
   var subFieldEl = el.getEl();
   YAHOO.util.Dom.setStyle(subFieldEl, 'margin-left', '4px');
   YAHOO.util.Dom.setStyle(subFieldEl, 'float', 'left');
   newDiv.appendChild( subFieldEl );
   
   // Subscribe the onChange event to resend it 
   el.updatedEvt.subscribe(this.onChange, this, true);

   // Arrows to order:
   if(this.options.sortable) {
      var arrowUp = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowUp'});
      YAHOO.util.Event.addListener(arrowUp, 'click', this.onArrowUp, this, true);
      var arrowDown = inputEx.cn('div', {className: 'inputEx-ListField-Arrow inputEx-ListField-ArrowDown'});
      YAHOO.util.Event.addListener(arrowDown, 'click', this.onArrowDown, this, true);
      newDiv.appendChild( arrowUp );
      newDiv.appendChild( arrowDown );
   }

   // Line breaker
   newDiv.appendChild( inputEx.cn('div', null, {clear: "both"}) );

   this.childContainer.appendChild(newDiv);
      
   return el;
};
   
/**
 * Switch a subField with its previous one
 * Called when the user clicked on the up arrow of a sortable list
 * @param {Event} e Original click event
 */
inputEx.ListField.prototype.onArrowUp = function(e) {
   var childElement = YAHOO.util.Event.getTarget(e).parentNode;
   
   var previousChildNode = null;
   var nodeIndex = -1;
   for(var i = 1 ; i < childElement.parentNode.childNodes.length ; i++) {
      var el=childElement.parentNode.childNodes[i];
      if(el == childElement) {
         previousChildNode = childElement.parentNode.childNodes[i-1];
         nodeIndex = i;
         break;
      }
   }
   
   if(previousChildNode) {
      // Remove the line
      var removedEl = this.childContainer.removeChild(childElement);
      
      // Adds it before the previousChildNode
      var insertedEl = this.childContainer.insertBefore(removedEl, previousChildNode);
      
      // Swap this.subFields elements (i,i-1)
      var temp = this.subFields[nodeIndex];
      this.subFields[nodeIndex] = this.subFields[nodeIndex-1];
      this.subFields[nodeIndex-1] = temp;
      
      // Color Animation
      if(this.arrowAnim) {
         this.arrowAnim.stop(true);
      }
      this.arrowAnim = new YAHOO.util.ColorAnim(insertedEl, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 0.4);
      this.arrowAnim.onComplete.subscribe(function() { YAHOO.util.Dom.setStyle(insertedEl, 'background-color', ''); });
      this.arrowAnim.animate();
      
      // Fire updated !
      this.fireUpdatedEvt();
   }
};

/**
 * Switch a subField with its next one
 * Called when the user clicked on the down arrow of a sortable list
 * @param {Event} e Original click event
 */
inputEx.ListField.prototype.onArrowDown = function(e) {
   var childElement = YAHOO.util.Event.getTarget(e).parentNode;
   
   var nodeIndex = -1;
   var nextChildNode = null;
   for(var i = 0 ; i < childElement.parentNode.childNodes.length ; i++) {
      var el=childElement.parentNode.childNodes[i];
      if(el == childElement) {
         nextChildNode = childElement.parentNode.childNodes[i+1];
         nodeIndex = i;
         break;
      }
   }
   
   if(nextChildNode) {
      // Remove the line
      var removedEl = this.childContainer.removeChild(childElement);
      // Adds it after the nextChildNode
      var insertedEl = YAHOO.util.Dom.insertAfter(removedEl, nextChildNode);
      
      // Swap this.subFields elements (i,i+1)
      var temp = this.subFields[nodeIndex];
      this.subFields[nodeIndex] = this.subFields[nodeIndex+1];
      this.subFields[nodeIndex+1] = temp;
      
      // Color Animation
      if(this.arrowAnim) {
         this.arrowAnim.stop(true);
      }
      this.arrowAnim = new YAHOO.util.ColorAnim(insertedEl, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 1);
      this.arrowAnim.onComplete.subscribe(function() { YAHOO.util.Dom.setStyle(insertedEl, 'background-color', ''); });
      this.arrowAnim.animate();
      
      // Fire updated !
      this.fireUpdatedEvt();
   }
};
   
/**
 * Called when the user clicked on a delete button.
 */
inputEx.ListField.prototype.onDelete = function(e, params) {
      
   YAHOO.util.Event.stopEvent(e);
      
   // Get the wrapping div element
   var elementDiv = YAHOO.util.Event.getTarget(e).parentNode;
      
   // Get the index of the subField
   var index = -1;
   
   //console.log(elementDiv);
   
   var subFieldEl = elementDiv.childNodes[1];
   for(var i = 0 ; i < this.subFields.length ; i++) {
      if(this.subFields[i].getEl() == subFieldEl) {
         index = i;
         break;
      }
   }
      
   // Remove it
   if(index != -1) {
      this.removeElement(index);
   }
      
   this.updatedEvt.fire(this.getValue());
};
   
/**
 * Remove the line from the dom and the subField from the list.
 */
inputEx.ListField.prototype.removeElement = function(index) {
   var elementDiv = this.subFields[index].getEl().parentNode;
      
   this.subFields[index] = undefined;
   this.subFields = inputEx.compactArray(this.subFields);
      
   // Remove the element
   elementDiv.parentNode.removeChild(elementDiv);
};

/**
 * Register this class as "list" type
 */
inputEx.registerType("list", inputEx.ListField);

