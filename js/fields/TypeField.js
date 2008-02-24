/**
 * Creates a type field with all the types in inpuEx.typeClasses
 *
 * @class inputEx.TypeField
 * @extends inputEx.SelectField
 * @constructor
 */
inputEx.TypeField = function(options) {
   
   var opts = {};
   for(var key in options) {
      if( options.hasOwnProperty(key) ) {
         opts[key] = options[key];
      }
   }
   // Build the "selectValues" property of SelectField options
   opts.selectValues = [""];
   opts.selectOptions = [""];
   for(var key in inputEx.typeClasses) {
      opts.selectValues.push( inputEx.typeClasses[key] );
      opts.selectOptions.push( key );
   }
   
   inputEx.TypeField.superclass.constructor.call(this, opts);
   
};

YAHOO.extend(inputEx.TypeField, inputEx.SelectField, {
   
   /**
    * Adds a div to wrap the component
    */
   renderComponent: function() {
      inputEx.TypeField.superclass.renderComponent.call(this);
      
      // DIV element to wrap the options group
      this.groupOptionsWrapper = inputEx.cn('div');
      this.divEl.appendChild( this.groupOptionsWrapper );
      
      // DIV element to wrap the div
      this.fieldWrapper = inputEx.cn('div');
      this.divEl.appendChild( this.fieldWrapper );
   },
   
   /**
    * Called when the type is changed, update the group options
    */
   onChange: function(e) {
      
      inputEx.TypeField.superclass.onChange.call(this, e);
      
      // Get value is directly the class !!
      var classO = this.getValue();
      
      if(classO.groupOptions) {
         
         // Close a previously created group
         if(this.group) {
            this.group.close();
            this.groupOptionsWrapper.innerHTML = "";
         }
         // Instanciate the group
         this.group = new inputEx.Group(classO.groupOptions);
         this.groupOptionsWrapper.appendChild( this.group.getEl() );
         
      }
      
      
      if(this.options.createValueField) {
      
         if(this.group) {
            // Register the updated event
            this.group.updatedEvt.subscribe(this.updateFieldValue, this, true);
         }
      
         if(this.fieldValue) {
            this.fieldValue = null;
            this.fieldWrapper.innerHTML = "";
         }
         // Create the value field
         this.updateFieldValue();
      }
      
   },
   
   
   updateFieldValue: function() {
   
      var previousValue = null;
      
      // Close previous field
      if(this.fieldValue) {
         previousValue = this.fieldValue.getValue();
         this.fieldValue.close();
         this.fieldWrapper.innerHTML = "";
      }

      // Get the field class
      var classO = this.getValue();

      // Get the form options
      var opts = this.group ? this.group.getValue() : null;

      // Instanciate the field
      this.fieldValue = new classO(opts);
      
      // Set the previous value
      if(previousValue) {
         this.fieldValue.setValue(previousValue);
      }

      // Add the field to the wrapper
      this.fieldWrapper.appendChild( this.fieldValue.getEl() );
      
   }
   
});


/**
 * Register this class as "select" type
 */
inputEx.registerType("type", inputEx.TypeField);





/**
 * group Options for each field
 */

inputEx.CheckBox.groupOptions = [
   {label: 'Label', type: 'string', optional: true, inputParams: {name: 'label'} }
];
inputEx.ColorField.groupOptions = [];
inputEx.EmailField.groupOptions = [];
inputEx.IPv4Field.groupOptions = [];
inputEx.PasswordField.groupOptions = []; 
inputEx.RTEField.groupOptions = [];
inputEx.UrlField.groupOptions = [];
inputEx.Textarea.groupOptions = [];
 
inputEx.Field.groupOptions = [
   { label: 'Numbers Only', type: 'boolean', optional: true, inputParams: {name: 'numbersOnly', checked: false} } 
];

inputEx.SelectField.groupOptions = [
   {  type: 'list', inputParams: {name: 'selectValues', listLabel: 'selectValues', elementType: inputEx.Field, elementOptions: {}, required: true} },
   {  type: 'list', optional: true, inputParams: {name: 'selectOptions', listLabel: 'selectOptions', elementType: inputEx.Field, elementOptions: {} } }
];

inputEx.ListField.groupOptions = [
   { name: 'type', label: 'of type', type: 'type', inputParams: {required: true, createValueField: false} } 
];
