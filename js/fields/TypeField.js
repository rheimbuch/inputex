/**
 * Creates a type field with all the types in inpuEx.typeClasses.
 * 
 * The value of a type field is following this format:
 *  {
    type: 'date',
    typeOptions: {
       ...
    }
 }
 *
 * Added options:
 * <ul>
 *    <li>createValueField: boolean, schould we create a "default value" field</li>
 * </ul>
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
      //opts.selectValues.push( inputEx.typeClasses[key] );
      opts.selectValues.push( key );
      opts.selectOptions.push( key );
   }
   
   inputEx.TypeField.superclass.constructor.call(this, opts);
   
};

YAHOO.extend(inputEx.TypeField, inputEx.SelectField, {
   
   /**
    * Set the value
    */
   setValue: function(value) {
      
      // Select:
      var index = 0;
      var option;
      for(var i = 0 ; i < this.options.selectValues.length ; i++) {
         if(value.type === this.options.selectValues[i]) {
            option = this.el.childNodes[i];
   		 option.selected = "selected";
         }
      }
      
      this.rebuildGroupOptions();
      
      if(!!this.group && !!value.typeOptions) {
         this.group.setValue(value.typeOptions);
      }
      
      
      if(this.options.createValueField) {
         this.updateFieldValue();
      
         if(!!this.fieldValue && !!value.defaultValue) {
            this.fieldValue.setValue(value.defaultValue);
         }
      }
   },
   
   /**
    * Return the value
    */
   getValue: function() {
      var obj = { type: this.options.selectValues[this.el.selectedIndex] };
      
      if(this.group) {
         obj.typeOptions = this.group.getValue();
      }
      if(this.fieldValue) {
         obj.defaultValue = this.fieldValue.getValue();
      }
      
      return obj;
   },
   
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
      
      this.rebuildGroupOptions();
      
   },
   
   rebuildGroupOptions: function() {
      // Get value is directly the class !!
      var classO = inputEx.getFieldClass(this.getValue().type);
      
      // if the class is not found, clear all the subfields and return
      if(classO === null) {
         this.groupOptionsWrapper.innerHTML = "";   
         this.fieldWrapper.innerHTML = "";
         this.fieldValue = null;
         return;
      }
      
      if(classO.groupOptions) {
         
         // Close a previously created group
         if(this.group) {
            this.group.close();
            this.groupOptionsWrapper.innerHTML = "";
         }
         // Instanciate the group
         this.group = new inputEx.Group(classO.groupOptions);
         // Register the updated event
         this.group.updatedEvt.subscribe(this.onChangeGroupOptions, this, true);
         this.groupOptionsWrapper.appendChild( this.group.getEl() );
         
      }
      
      
      if(this.options.createValueField) {
      
         if(this.fieldValue) {
            this.fieldValue = null;
            this.fieldWrapper.innerHTML = "";
         }
         // Create the value field
         this.updateFieldValue();
      }
   },
   
   onChangeGroupOptions: function() {
      
      if(this.options.createValueField) {
         this.updateFieldValue();
      }
      
      if(this.validate()) {
   	   // Uses setTimeout to escape the stack (that originiated in an event)
   	   var that = this;
   	   setTimeout(function() {
      	   that.updatedEvt.fire(that.getValue());
   	   },50);
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
      var classO = inputEx.getFieldClass(this.getValue().type);
      
      if(classO === null) {
         return;
      }

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

inputEx.TypeField.groupOptions = [
   { label: 'default value field', type: 'boolean', optional: true, inputParams: {name:'createValueField', checked: false}}
];
 
inputEx.Field.groupOptions = [
   { label: 'Numbers Only', type: 'boolean', optional: true, inputParams: {name: 'numbersOnly', checked: false} } 
];

inputEx.SelectField.groupOptions = [
   {  type: 'list', inputParams: {name: 'selectValues', listLabel: 'selectValues', elementType: {type: 'string'}, required: true} },
   {  type: 'list', optional: true, inputParams: {name: 'selectOptions', listLabel: 'selectOptions', elementType: {type: 'string'} } }
];

inputEx.ListField.groupOptions = [
   { label: 'of type', type: 'type', inputParams: {required: true, createValueField: false, name: 'elementType'} },
   { label: 'List label', type: 'string', optional: true, inputParams: {name: 'listLabel'}}
];
