/**
 * @class Creates a type field with all the types in inpuEx.typeClasses.
  * 
  * The value of a type field is following this format:
  *  
  {
     label: 'Enter your Birthdate',
     type: 'date',
     optional: false,
     inputParams: {name: 'birthdate',required: true, noicon: true, ...typeGroupOptionValues.. }
  }
 * @extends inputEx.Field
 * @constructor
 */
inputEx.TypeField = function(options) {
   inputEx.TypeField.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.TypeField, inputEx.Field, {
   
   /**
    * NOT IMPLEMENTED: Set the value
    */
   setValue: function(value) {
      
   },
   
   /**
    * Return the config for a entry in an Group
    */
   getValue: function() {
      
      var V = this.typePropertiesGroup.getValue();
      
      var obj = { 
         type: V.type,
         label: this.inplaceEditLabel.getValue()
      };
      if(V.optional) { obj.optional = true; }
      
      // InputParams
      var inputParams = this.group.getValue();
      obj.inputParams = inputParams;
      obj.inputParams.name = V.name;
      if(V.required) { obj.inputParams.required = true; }
      obj.inputParams.tooltipIcon = !V.noicon;
      if(this.fieldValue) { obj.inputParams.value = this.fieldValue.getValue(); }
      
      return obj;
   },
   
   /**
    * Very specific component rendering
    */
   renderComponent: function() {
      
      // Label InplaceEdit Field
      this.inplaceEditLabel = new inputEx.InPlaceEdit({name: "label",editorField:{type: 'string'}});
      var inplaceEditEl = this.inplaceEditLabel.getEl();
      YAHOO.util.Dom.setStyle(inplaceEditEl, 'float', 'left');
      this.divEl.appendChild(inplaceEditEl);
      
      // DIV element to wrap the Field "default value"
      this.fieldWrapper = inputEx.cn('div', null, null, '');
      YAHOO.util.Dom.setStyle(this.fieldWrapper, 'float', 'left');
      YAHOO.util.Dom.setStyle(this.fieldWrapper, 'margin-left', '4px');
      this.divEl.appendChild( this.fieldWrapper );
      
      // The properties panel is hidden first
      this.renderPropertiesPanel();
      
      // This create the "default value" field from the properties panel default value 
      // (ie render a basic field with all default values)
      this.updateFieldValue();
   },
   
   renderPropertiesPanel: function() {
      
      this.propertyPanel = inputEx.cn('div', {className: "inputEx-TypeField-PropertiesPanel"}, {display: 'none'});
      
       // The list of all inputEx declared types to be used in the "type" selector
         var selectOptions = [];
         for(var key in inputEx.typeClasses) {
            if(inputEx.typeClasses.hasOwnProperty(key)) {
               selectOptions.push( key );  
            }
         }

         // Type Properties:
         this.typePropertiesGroup = new inputEx.Group({fields: [
            {label: "Type", type: "select", inputParams: {name: "type", selectOptions: selectOptions, selectValues: selectOptions} },
            {label: "Optional?", type: "boolean", inputParams: {name: "optional", value: false} },
            {label: "Name", type: "string", inputParams:{name: "name"} },
            {label: "Required?", type: "boolean", inputParams: {name: "required", value: false} },
            {label: "Dont display icon", type: "boolean", inputParams: {name: "noicon", value: true} }
         ]});
         var groupEl = this.typePropertiesGroup.getEl();
         this.propertyPanel.appendChild( groupEl );

         // DIV element to wrap the options group
         this.groupOptionsWrapper = inputEx.cn('div');
         this.propertyPanel.appendChild( this.groupOptionsWrapper );
      
         // Build the groupOptions
         this.rebuildGroupOptions();

         
         // Button to switch the panel
         this.button = inputEx.cn('div', {className: "inputEx-TypeField-EditButton"}, {position: "relative"});
         this.button.appendChild(this.propertyPanel);
         this.divEl.appendChild(this.button);
         
         // This is a line breaker :
         this.divEl.appendChild( inputEx.cn('div', null, {clear: 'both'}) );
   },
   
   /**
    * Adds 2 event listeners: 
    *  - on the button to toggel the propertiesPanel
    */
   initEvents: function() {
      inputEx.TypeField.superclass.initEvents.call(this); 
      
      // "Toggle the properties panel" button :
      YAHOO.util.Event.addListener(this.button, 'click', this.onTogglePropertiesPanel, this, true);
      
      // Prevent the button to receive a "click" event if the propertyPanel doesn't catch it
      YAHOO.util.Event.addListener(this.propertyPanel, 'click', function(e) { YAHOO.util.Event.stopPropagation(e);}, this, true);
      
      // Hack the type selector to rebuild the group option
      this.typePropertiesGroup.inputsNames["type"].updatedEvt.subscribe(function() { this.rebuildGroupOptions(); }, this, true);
      
      // Listen the "type" selector to update the groupOptions
      this.typePropertiesGroup.updatedEvt.subscribe(this.onChangeGroupOptions, this, true);
      
      // Listen the change event from the label InPlaceEditor
      this.inplaceEditLabel.updatedEvt.subscribe(this.onChangeGroupOptions, this, true);
   },
   
   onTogglePropertiesPanel: function() {
      this.propertyPanel.style.display = this.propertyPanel.style.display == 'none' ? '' : 'none';
   },
   
   rebuildGroupOptions: function() {
      // Get value is directly the class !!
      var classO = inputEx.getFieldClass( this.group ? this.getValue().type : "string");
      
      // if the class is not found, clear all the subfields and return
      if(classO === null) {
         this.groupOptionsWrapper.innerHTML = "";   
         this.fieldWrapper.innerHTML = '';
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
         this.group = new inputEx.Group({fields: classO.groupOptions});
         // Register the updated event
         this.group.updatedEvt.subscribe(this.onChangeGroupOptions, this, true);
         this.groupOptionsWrapper.appendChild( this.group.getEl() );
         
      }
      else {
         throw new Error("no groupOptions for this class !");
      }
      
      
      if(this.fieldValue) {
         this.fieldValue = null;
         this.fieldWrapper.innerHTML = '';
      }
      // Create the value field
      this.updateFieldValue();
   },
   
   onChangeGroupOptions: function() {
      
      if(this.options.createValueField) {
         this.updateFieldValue();
      }
      
      // Fire updatedEvt
      this.fireUpdatedEvt();
   },
   
   
   updateFieldValue: function() {
   
      var previousValue = null;
      
      // Close previous field
      if(this.fieldValue) {
         previousValue = this.fieldValue.getValue();
         this.fieldValue.close();
         this.fieldWrapper.innerHTML = '';
      }

      // Get the field class
      var classO = inputEx.getFieldClass(this.getValue().type);
      
      if(classO === null) {
         return;
      }

      // Get the form options
      var opts = this.group.getValue();

      // Instanciate the field
      this.fieldValue = new classO(opts);
      
      // Set the previous value
      if(previousValue) {
         this.fieldValue.setValue(previousValue);
      }
      
      // Refire the event when the fieldValue is updated
      this.fieldValue.updatedEvt.subscribe(function() {
         this.fireUpdatedEvt();
      }, this, true);

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

if(inputEx.CheckBox) {
   inputEx.CheckBox.groupOptions = [ {label: 'Label', type: 'string', optional: true, inputParams: {name: 'label'} } ];
}

if(inputEx.ColorField) {
   inputEx.ColorField.groupOptions = [];
}

if(inputEx.DateField) {
   inputEx.DateField.groupOptions = [];
}

if(inputEx.PairField) {
   inputEx.PairField.groupOptions = [
      {label: 'Left field', type: 'type', inputParams: {name: 'leftFieldOptions', required: true} },
      {label: 'Right field', type: 'type', inputParams: {name: 'rightFieldOptions', required: true} }
   ];
}

if(inputEx.EmailField) {
   inputEx.EmailField.groupOptions = [];
}

if(inputEx.IPv4Field) {
   inputEx.IPv4Field.groupOptions = [];
}

if(inputEx.PasswordField) {
   inputEx.PasswordField.groupOptions = []; 
}

if(inputEx.RTEField) {
   inputEx.RTEField.groupOptions = [];
}

if(inputEx.UrlField) {
   inputEx.UrlField.groupOptions = [];
}

if(inputEx.Textarea) {
   inputEx.Textarea.groupOptions = [];
}
 
if(inputEx.SelectField) {
   inputEx.SelectField.groupOptions = [
      {  type: 'list', inputParams: {name: 'selectValues', listLabel: 'selectValues', elementType: {type: 'string'}, required: true} },
      {  type: 'list', optional: true, inputParams: {name: 'selectOptions', listLabel: 'selectOptions', elementType: {type: 'string'} } }
   ];
}

if(inputEx.ListField) {
   inputEx.ListField.groupOptions = [
      { label: 'of type', type: 'type', inputParams: {required: true, createValueField: false, name: 'elementType'} },
      { label: 'List label', type: 'string', optional: true, inputParams: {name: 'listLabel'}}
   ];
}
 
inputEx.StringField.groupOptions = [
   { label: 'Numbers Only', type: 'boolean', optional: true, inputParams: {name: 'numbersOnly', checked: false} } 
];

inputEx.TypeField.groupOptions = [
   { label: 'default value field', type: 'boolean', optional: true, inputParams: {name:'createValueField', checked: false}}
];


if(inputEx.Group) {
   inputEx.Group.groupOptions = [
      {label: 'Fields', type: 'list', inputParams:{ name: 'fields', elementType: {type: 'type' } } }
   ];
}



