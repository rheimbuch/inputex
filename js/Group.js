(function() {
   
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;
   
/**
 * @class Handle a group of fields
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options with legend,collapsible,fields: Array of input fields : { label: 'Enter the value:' , type: 'text' or fieldClass: inputEx.Field, optional: true/false, inputParams: {inputparams object} }
 */
inputEx.Group = function(options) {
   inputEx.Group.superclass.constructor.call(this,options);
};
lang.extend(inputEx.Group, inputEx.Field, 
/**
 * @scope inputEx.Group.prototype   
 */   
{
   
   /**
    * Adds some options: legend, collapsible, fields...
    */
   setOptions: function() {
   
      this.options.legend = this.options.legend || '';
   
      this.inputConfigs = this.options.fields;
   
      this.options.collapsible = lang.isUndefined(this.options.collapsible) ? false : this.options.collapsible;
      
      // Array containing the list of the field instances
      this.inputs = [];

      // Associative array containing the field instances by names
      this.inputsNames = {};
   },

   /**
    * Render the group
    */
   render: function() {
   
      // Create the div wrapper for this group
	   this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
  	   
  	   this.renderFields(this.divEl);  	  
   },
   
   /**
    * Render all the fields.
    * We use the parentEl so that inputEx.Form can append them to the FORM tag
    */
   renderFields: function(parentEl) {
      
      this.fieldset = inputEx.cn('fieldset');
      this.legend = inputEx.cn('legend');
   
      // Option Collapsible
      if(this.options.collapsible) {
         var collapseImg = inputEx.cn('div', {className: 'inputEx-Group-collapseImg'}, null, ' ');
         this.legend.appendChild(collapseImg);
         inputEx.sn(this.fieldset,{className:'inputEx-Expanded'});
      }
   
      if(this.options.legend != '') {
         this.legend.innerHTML += (" "+this.options.legend);
      }
   
      this.fieldset.appendChild(this.legend);
  	   
      // Iterate this.createInput on input fields
      for (var i = 0 ; i < this.inputConfigs.length ; i++) {
         var input = this.inputConfigs[i];

         var groupItem = inputEx.cn('div', {className: 'inputEx-Group-GroupItem'});
         
         // Hide the row if type == "hidden"
         if(input.type == 'hidden') {
            Dom.setStyle(groupItem, 'display', 'none');
         }
         
         // Label element
         groupItem.appendChild( inputEx.cn('div', {className: 'inputEx-Group-label'}, null, input.label || "") );
        
         // Render the field (and adds it into this.inputs)
         var field = this.renderField(input);
    	   
         // Field element
         var groupItemField = inputEx.cn('div', {className: 'inputEx-Group-field'});
         groupItemField.appendChild(field.getEl() );
         groupItem.appendChild(groupItemField);
         
         // Description
         if(input.description) {
            groupItem.appendChild(inputEx.cn('div', {className: 'inputEx-Group-description'}, null, input.description));
         }
         
         this.fieldset.appendChild( inputEx.cn('div',null, {clear: 'both'}," ") );
         this.fieldset.appendChild(groupItem);
  	   }
  	
  	   // Append the fieldset
  	   parentEl.appendChild(this.fieldset);
   },
  
   /**
    * Instanciate one field given its parameters, type or fieldClass
    * @param {Object} fieldOptions The field properties as required bu inputEx.buildField
    */
   renderField: function(fieldOptions) {

      // Instanciate the field
      var fieldInstance = inputEx.buildField(fieldOptions);      
      
	   this.inputs.push(fieldInstance);
      
      // Create an index to access fields by their name
      if(fieldInstance.options.name) {
         this.inputsNames[fieldInstance.options.name] = fieldInstance;
      }
      
	   // Subscribe to the field "updated" event to send the group "updated" event
      fieldInstance.updatedEvt.subscribe(this.onChange, this, true);
   	  
      return fieldInstance;
   },
  
   /**
    * Add a listener for the 'collapsible' option
    */
   initEvents: function() {
      if(this.options.collapsible) {
         Event.addListener(this.legend, "click", this.toggleCollapse, this, true);
      }
   },

   /**
    * Toggle the collapse state
    */
   toggleCollapse: function() {
      if(Dom.hasClass(this.fieldset, 'inputEx-Expanded')) {
         Dom.replaceClass(this.fieldset, 'inputEx-Expanded', 'inputEx-Collapsed');
      }
      else {
         Dom.replaceClass(this.fieldset, 'inputEx-Collapsed','inputEx-Expanded');
      }
   },
   
   /**
    * Validate each field
    * @returns {Boolean} true if all fields validate and required fields are not empty
    */
   validate: function() {
      // Validate all the sub fields
      for (var i = 0 ; i < this.inputs.length ; i++) {
   	   var input = this.inputs[i];
   	   var state = input.getState();
   	   if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
   		   return false;
   	   }
      }
      return true;
   },
   
   /**
    * Enable all fields in the group
    */
   enable: function() {
 	   for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].enable();
      }
   },
   
   /**
    * Disable all fields in the group
    */
   disable: function() {
 	   for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].disable();
      }
   },
   
   /**
    * Set the values of each field from a key/value hash object
    */
   setValue: function(oValues) {
      if(!oValues) return;
	   for (var i = 0 ; i < this.inputs.length ; i++) {
	      if(this.inputs[i].options.name && !lang.isUndefined(oValues[this.inputs[i].options.name]) ) {
		      this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
		      this.inputs[i].setClassFromState();
	      }
      }
   },
   
   /**
    * Return an object with all the values of the fields
    */
   getValue: function() {
	   var o = {};
	   for (var i = 0 ; i < this.inputs.length ; i++) {
	      if(this.inputs[i].options.name) {
		      o[this.inputs[i].options.name] = this.inputs[i].getValue();
	      }
      }
	   return o;
   },
  
   /**
    * Close the group (recursively calls "close" on each field, does NOT hide the group )
    * Call this function before hidding the group to close any field popup
    */
   close: function() {
      for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].close();
      }
   },

   /**
    * Set the focus to the first input in the group
    */
   focus: function() {
      if( this.inputs.length > 0 ) {
         this.inputs[0].focus();
      }
   },

   /**
    * Return the sub-field instance by its name property
    * @param {String} fieldName The name property
    */
   getFieldByName: function(fieldName) {
      if( !this.inputsNames.hasOwnProperty(fieldName) ) return null;
      return this.inputsNames[fieldName];
   }

});

   
/**
 * Register this class as "group" type
 */
inputEx.registerType("group", inputEx.Group);


})();