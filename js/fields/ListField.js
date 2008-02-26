/**
 * Create a list field
 *
 * @class   inputEx.ListField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options same as parent class options
 */
inputEx.ListField = function(options) {
   
   /**
    * List of all the subField instances
    */
   this.subFields = [];
   
   inputEx.ListField.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.ListField,inputEx.Field, {
   
   /**
    * Set the ListField classname
    */
   setOptions: function() {
      inputEx.ListField.superclass.setOptions.call(this);
      this.options.className='inputEx-Field inputEx-ListField';
   },
   
   /**
    * Render the addButton 
    */
   renderComponent: function() {
      
      // Add element button
      this.addButton = inputEx.cn('img', {src: inputEx.spacerUrl, className: 'inputEx-ListField-addButton'});
      this.divEl.appendChild(this.addButton);
      
      // List label
      this.divEl.appendChild( inputEx.cn('span', null, {marginLeft: "4px"}, this.options.listLabel) );
   },
   
   /**
    * Handle the click event on the add button
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.addButton, 'click', function() { this.addElement(); }, this, true);
   },
   
   /**
    * Set the value of all the subfields
    */
   setValue: function(value) {
      if(!value.length) return;
      
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
   },
   
   /**
    * Return the array of values
    */
   getValue: function() {
      var values = [];
      for(var i = 0 ; i < this.subFields.length ; i++) {
         values[i] = this.subFields[i].getValue();
      }
      return values;
   },
   
   /**
    * Adds an element
    */
   addElement: function(value) {

      // Render the subField
      var subFieldEl = this.renderSubField(value);
      
      // Adds it to the local list
      this.subFields.push(subFieldEl);
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
      YAHOO.util.Event.addListener( delButton, 'click', this.onDelete, this, true);
      newDiv.appendChild( delButton );
      
      // Instanciate the new subField
      var class0 = inputEx.getFieldClass(this.options.elementType.type);
      var options = {};
      if( this.options.elementType.typeOptions) {
         for(var key in this.options.elementType.typeOptions) {
            if(this.options.elementType.typeOptions.hasOwnProperty(key) ) {
               options[key] = this.options.elementType.typeOptions[key];
            }
         }
      }
      if(value) { options.value = value; }
      
      var el = new class0(options);
      var subFieldEl = el.getEl();
      YAHOO.util.Dom.setStyle(subFieldEl, 'margin-left', '4px');
      YAHOO.util.Dom.setStyle(subFieldEl, 'float', 'left');
      newDiv.appendChild( subFieldEl );
      
      // Subscribe the onChange event to resend it 
      el.updatedEvt.subscribe(this.onChange, this, true);

      // Line breaker
      newDiv.appendChild( inputEx.cn('div', null, {clear: "both"}) );

      this.divEl.appendChild(newDiv);
      
      return el;
   },
   
   /**
    * Called when the user clicked on a delete button.
    */
   onDelete: function(e, params) {
      
      // Get the wrapping div element
      var elementDiv = e.originalTarget.parentNode;
      
      // Get the index of the subField
      var index = -1;
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
   },
   
   /**
    * Remove the line from the dom and the subField from the list.
    */
   removeElement: function(index) {
      
      var elementDiv = this.subFields[index].getEl().parentNode;
      
      this.subFields[index] = undefined;
      this.subFields = this.subFields.compact();
      
      // Remove the element
      elementDiv.parentNode.removeChild(elementDiv);
   }
   
});


/**
 * Register this class as "list" type
 */
inputEx.registerType("list", inputEx.ListField);

