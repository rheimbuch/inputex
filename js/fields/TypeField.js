(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class Creates a type field with all the types in inpuEx.typeClasses.
  * 
  * The value of a type field is following this format:
  *  
  {
     label: 'Enter your Birthdate',
     type: 'date',
     inputParams: {name: 'birthdate',required: true, showMsg: true, ...typeGroupOptionValues.. }
  }
 * @extends inputEx.Field
 * @constructor
 */
inputEx.TypeField = function(options) {
   inputEx.TypeField.superclass.constructor.call(this, options);
};

YAHOO.lang.extend(inputEx.TypeField, inputEx.Field, 
/**
 * @scope inputEx.TypeField.prototype   
 */   
{
   
   /**
    * Set the value of the label, typeProperties and group
    * @param {Object} value Type object configuration
    */
   setValue: function(value) {
      
      // Label: 
      this.inplaceEditLabel.setValue(value.label);
      
      // Field:
      this.typePropertiesGroup.setValue({
        type: value.type,
        name: value.inputParams.name,
        required: value.inputParams.required,
        showMsg: value.inputParams.showMsg
      });
      this.rebuildGroupOptions();
      this.group.setValue(value.inputParams);
   },
   
   /**
    * Return the config for a entry in an Group
    * @return {Object} Type object configuration
    */
   getValue: function() {
      
      var V = this.typePropertiesGroup.getValue();
      
      var obj = { type: V.type };
      
      // InputParams
      var inputParams = this.group.getValue();
      console.log(inputParams);
      obj.inputParams = inputParams;
      obj.inputParams.name = V.name;
      obj.inputParams.label = this.inplaceEditLabel.getValue();
      if(V.required) { obj.inputParams.required = true; }
      if(V.showMsg) {
         obj.inputParams.showMsg = V.showMsg;
      }
      if(this.fieldValue) { obj.inputParams.value = this.fieldValue.getValue(); }
      
      return obj;
   },
   
   /**
    * Render an inPlaceEdit for label and the properties panel
    */
   renderComponent: function() {
      
      // Label InplaceEdit Field
      this.inplaceEditLabel = new inputEx.InPlaceEdit({name: "label",editorField:{type: 'string'}});
      var inplaceEditEl = this.inplaceEditLabel.getEl();
      Dom.setStyle(inplaceEditEl, 'float', 'left');
      this.fieldContainer.appendChild(inplaceEditEl);
      
      // DIV element to wrap the Field "default value"
      this.fieldWrapper = inputEx.cn('div', null, null, '');
      Dom.setStyle(this.fieldWrapper, 'float', 'left');
      Dom.setStyle(this.fieldWrapper, 'margin-left', '4px');
      this.fieldContainer.appendChild( this.fieldWrapper );
      
      // The properties panel is hidden first
      this.renderPropertiesPanel();
      
      // This create the "default value" field from the properties panel default value 
      // (ie render a basic field with all default values)
      this.updateFieldValue();
   },
   
   /**
    * Render the popup that will contain the property form
    */
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
            {type: "select", inputParams: {label: "Type", name: "type", selectOptions: selectOptions, selectValues: selectOptions} },
            //{label: "Optional?", type: "boolean", inputParams: {name: "optional", value: false} },
            { type: "string", inputParams:{label: "Name", name: "name"} },
            { type: "boolean", inputParams: {label: "Required?",name: "required", value: false} },
            { type: "boolean", inputParams: {label: "Display messages",name: "showMsg", value: false} }
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
         this.fieldContainer.appendChild(this.button);
         
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
      Event.addListener(this.button, 'click', this.onTogglePropertiesPanel, this, true);
      
      // Prevent the button to receive a "click" event if the propertyPanel doesn't catch it
      Event.addListener(this.propertyPanel, 'click', function(e) { Event.stopPropagation(e);}, this, true);
      
      // Hack the type selector to rebuild the group option
      this.typePropertiesGroup.inputsNames["type"].updatedEvt.subscribe(function() { this.rebuildGroupOptions(); }, this, true);
      
      // Listen the "type" selector to update the groupOptions
      this.typePropertiesGroup.updatedEvt.subscribe(this.onChangeGroupOptions, this, true);
      
      // Listen the change event from the label InPlaceEditor
      this.inplaceEditLabel.updatedEvt.subscribe(this.onChangeGroupOptions, this, true);
   },
   
   /**
    * Toggle the property panel
    */
   onTogglePropertiesPanel: function() {
      this.propertyPanel.style.display = (this.propertyPanel.style.display == 'none') ? '' : 'none';
   },
   
   /**
    * Regenerate the property form
    */
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
            //this.group.destroy();
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
   
   /**
    * Update the fieldValue with the changed properties
    */
   onChangeGroupOptions: function() {
      
      this.updateFieldValue();
      
      // Fire updatedEvt
      this.fireUpdatedEvt();
   },
   
   /**
    * Update the fieldValue
    */
   updateFieldValue: function() {
   
      // Close previous field
      if(this.fieldValue) {
         this.fieldValue.close();
        // this.fieldValue.destroy();
         this.fieldWrapper.innerHTML = '';
      }
      
      // Re-build the fieldValue
      var fieldOptions = { type: this.getValue().type, inputParams: this.group.getValue() };
      this.fieldValue = inputEx.buildField(fieldOptions);
      
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
   inputEx.CheckBox.groupOptions = [ {type: 'string', inputParams: {label: 'Label', name: 'label'} } ];
}

if(inputEx.ColorField) {
   inputEx.ColorField.groupOptions = [];
}

if(inputEx.DateField) {
   inputEx.DateField.groupOptions = [
      {type: 'select', inputParams: {label: 'Date format', name: 'dateFormat', selectOptions: ["m/d/Y", "d/m/Y"], selectValues: ["m/d/Y", "d/m/Y"] } }
   ];
}

if(inputEx.CombineField) {
   inputEx.CombineField.groupOptions = [
      { type: 'list', inputParams: {name: 'fields', label: 'Elements', required: true, elementType: {type: 'type'} } }
   ];
}

if(inputEx.PairField) {
   inputEx.PairField.groupOptions = [
      { type: 'type', inputParams: {label: 'Left field', name: 'leftFieldOptions', required: true} },
      { type: 'type', inputParams: {label: 'Right field', name: 'rightFieldOptions', required: true} }
   ];
}

if(inputEx.EmailField) {
   inputEx.EmailField.groupOptions = [];
}

if(inputEx.IPv4Field) {
   inputEx.IPv4Field.groupOptions = [];
}

if(inputEx.PasswordField) {
   inputEx.PasswordField.groupOptions = [
      {type: 'boolean', inputParams: {label: 'Strength indicator', name: 'strengthIndicator', value: false} },
      {type: 'boolean', inputParams: {label: 'CapsLock warning', name: 'capsLockWarning', value: false} }
   ]; 
}


if(inputEx.RadioField) {
   inputEx.RadioField.groupOptions = [
      {type: 'list', inputParams: {label: 'Options', name: 'choices', elementType: {type: 'string'} } },
      {type: 'boolean', inputParams: {label: 'Allow custom value', name: 'allowAny'} }
   ];
}

if(inputEx.RTEField) {
   inputEx.RTEField.groupOptions = [];
}

if(inputEx.UrlField) {
   inputEx.UrlField.groupOptions = [
      {  type: 'boolean', inputParams: {label: 'Display favicon', name:'favicon', value: true}}
   ];
}

if(inputEx.Textarea) {
   inputEx.Textarea.groupOptions = [];
}
 
if(inputEx.SelectField) {
   inputEx.SelectField.groupOptions = [
      {  type: 'list', inputParams: {name: 'selectValues', listLabel: 'selectValues', elementType: {type: 'string'}, required: true} },
      {  type: 'list', inputParams: {name: 'selectOptions', listLabel: 'selectOptions', elementType: {type: 'string'} } }
   ];
}


if(inputEx.SliderField) {
   inputEx.SliderField.groupOptions = [
      { type: 'integer', inputParams: {label: 'Min. value',  name: 'minValue', value: 0} },
      { type: 'integer', inputParams: {label: 'Max. value', name: 'maxValue', value: 100} }
   ];
}

if(inputEx.ListField) {
   inputEx.ListField.groupOptions = [
      { type: 'type', inputParams: {label: 'of type', required: true, name: 'elementType'} },
      { type: 'string', inputParams: {label: 'List label', name: 'listLabel'}}
   ];
}
 

if(inputEx.IntegerField) {
   inputEx.IntegerField.groupOptions = [
      { type: 'integer', inputParams: {label: 'Radix', name: 'radix'}}
   ];
}

if(inputEx.NumberField) {
   inputEx.NumberField.groupOptions = [];
}
 
inputEx.StringField.groupOptions = [
   { inputParams: { label: 'Type invite', name: 'typeInvite'}},
   { type: 'integer', inputParams: { label: 'Size', name: 'size', value: 20}},
   { type: 'integer', inputParams: { label: 'Min. length', name: 'minLength'}}
];

inputEx.TypeField.groupOptions = [
   //{ type: 'boolean', inputParams: {label: 'default value field', name:'createValueField', value: false}}
];


if(inputEx.Group) {
   inputEx.Group.groupOptions = [
      { inputParams: { label: 'Legend', name:'legend'}},
      { type: 'boolean', inputParams: {label: 'Collapsible', name:'collapsible', value: false}},
      { type: 'list', inputParams:{ label: 'Fields', name: 'fields', elementType: {type: 'type' } } }
   ];
}


if(inputEx.Form) {
   inputEx.Form.groupOptions = [
      { inputParams: {label: 'Legend', name:'legend'}},
      { type: 'boolean', inputParams: { label: 'Collapsible', name:'collapsible', value: false}},
      {type: 'list', inputParams:{ label: 'Fields', name: 'fields', elementType: {type: 'type' } } },
      {type: 'list', inputParams:{ 
         listLabel: 'Buttons', 
         name: 'buttons', 
            elementType: {
               type: 'group', 
               inputParams: { 
                  fields: [
                     { inputParams: {label: 'Label', name: 'value'}},
                     { type: 'select', inputParams: {label: 'Type', name: 'type', selectValues:["button", "submit"]} }
                  ] 
               } 
            } 
         } 
      }
   ];
}


if(inputEx.InPlaceEdit) {
   inputEx.InPlaceEdit.groupOptions = [
      { type:'type', inputParams: {label: 'Editor', name: 'editorField'} }
   ];
}


})();