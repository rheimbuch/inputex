/**
 * @class Handle a group of fields
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options with optionsLabel,fields: Array of input fields : { label: 'Enter the value:' , type: 'text' or fieldClass: inputEx.Field, optional: true/false, inputParams: {inputparams object} }
 */
inputEx.Group = function(options) {
   inputEx.Group.superclass.constructor.call(this,options);
};
YAHOO.extend(inputEx.Group, inputEx.Field);

inputEx.Group.prototype.setOptions = function() {
   this.options.optionsLabel = this.options.optionsLabel || 'Options';
   this.inputConfigs = this.options.fields;
      
   // Array containing the list of the field instances
   this.inputs = [];

   // Associative array containing the field instances by names
   this.inputsNames = {};
};

/**
 * Render the group
 */
inputEx.Group.prototype.render= function() {
   
   // Create the div wrapper for this group
	this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
  	   
  	this.renderFields(this.divEl);  	  
};
   
/**
 * Render all the fields.
 * We use the parentEl so that inputEx.Form can append them to the FORM tag
 */
inputEx.Group.prototype.renderFields = function(parentEl) {
      
   // Table containing non-optional fields
 	var tableNonOptional = inputEx.cn('table');
  	var tbodyNonOptional = inputEx.cn('tbody');
  	tableNonOptional.appendChild(tbodyNonOptional);
  	   
  	// Table containing optional fields
  	this.tableOptional = inputEx.cn('table', {className: 'inputEx-Group-Options'}, {display: 'none'});
  	var tbodyOptional = inputEx.cn('tbody');
  	this.tableOptional.appendChild(tbodyOptional);
  	   
   // Iterate this.createInput on input fields
   for (var i = 0 ; i < this.inputConfigs.length ; i++) {
      var input = this.inputConfigs[i];

      var tr = inputEx.cn('tr');
         
      // Hide the row if type == "hidden"
      if(input.type == 'hidden') {
         YAHOO.util.Dom.setStyle(tr, 'display', 'none');
      }
         
      // Label element
      tr.appendChild( inputEx.cn('td', {className: 'inputEx-Group-label'}, null, input.label || "") );
        
       // Render the field (and adds it into this.inputs)
       var field = this.renderField(input);
    	   
       // If the input has the "optional" parameter, put it in the optionsEl
       var td = inputEx.cn('td');
       td.appendChild(field.getEl() );
       tr.appendChild(td);
            
       // Select the tbody to insert the row into
      var tbody = input.optional ? tbodyOptional : tbodyNonOptional;
      tbody.appendChild(tr);
  	}
  	   
  	// Append the non-optional table
  	this.tableNonOptional = tableNonOptional;
  	parentEl.appendChild(tableNonOptional);
  	  
  	// Options: toggle the element
  	if(tbodyOptional.childNodes.length > 0) {
 	   this.optionsLabel = inputEx.cn('div', {className: 'inputEx-Group-Options-Label inputEx-Group-Options-Label-Collapsed'});
 	   this.optionsLabel.appendChild( inputEx.cn('img', {src: inputEx.spacerUrl}) );
 	   this.optionsLabel.appendChild( inputEx.cn('span',null,null, this.options.optionsLabel) );
 	   parentEl.appendChild(this.optionsLabel);
    	parentEl.appendChild(this.tableOptional);
  	}
  	   
};
  
/**
 * Instanciate one field given its parameters, type or fieldClass
 */
inputEx.Group.prototype.renderField = function(fieldOptions) {

   // Instanciate the field
   var fieldInstance = inputEx.buildField(fieldOptions);      
      
	this.inputs.push(fieldInstance);
      
   // Store link between field_name and field_position in group
	if (!!fieldInstance.el && !!fieldInstance.el.name) {
      this.inputsNames[fieldInstance.el.name] = fieldInstance;
   }
      
	// Subscribe to the field "updated" event to send the group "updated" event
   fieldInstance.updatedEvt.subscribe(this.onChange, this, true);
   	  
   return fieldInstance;
};
  
/**
 * Init the events for the group
 */
inputEx.Group.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.optionsLabel, "click", this.onClickOptionsLabel, this, true);
};
  
/**
 * Handle the click on the "Options" label
 */
inputEx.Group.prototype.onClickOptionsLabel = function() {
   if(this.tableOptional.style.display == 'none') {
      this.tableOptional.style.display = '';
      YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Collapsed", "inputEx-Group-Options-Label-Expanded");
   }
   else {
      this.tableOptional.style.display = 'none';
      YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Expanded", "inputEx-Group-Options-Label-Collapsed");
   }
};
  
/**
 * Return the group wrapper DIV element
 */
inputEx.Group.prototype.getEl = function() {
   return this.divEl;
};
   
/**
 * Validate each field
 * @returns {Boolean} true if all fields validate and required fields are not empty
 */
inputEx.Group.prototype.validate = function() {
   // Validate all the sub fields
   for (var i = 0 ; i < this.inputs.length ; i++) {
   	var input = this.inputs[i];
   	var state = input.getState();
   	if( state == inputEx.stateRequired || state == inputEx.stateInvalid ) {
   		return false;
   	}
   }
   return true;
};
   
/**
 * Enable all fields in the group
 */
inputEx.Group.prototype.enable = function() {
 	for (var i = 0 ; i < this.inputs.length ; i++) {
 	   this.inputs[i].enable();
   }
};
   
/**
 * Disable all fields in the group
 */
inputEx.Group.prototype.disable = function() {
 	for (var i = 0 ; i < this.inputs.length ; i++) {
 	   this.inputs[i].disable();
   }
};
   
/**
 * Set the values of each field from a key/value hash object
 */
inputEx.Group.prototype.setValue = function(oValues) { 
   if(!oValues) return;
	for (var i = 0 ; i < this.inputs.length ; i++) {
	   if(this.inputs[i].options.name && !YAHOO.lang.isUndefined(oValues[this.inputs[i].options.name]) ) {
		   this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
		   this.inputs[i].setClassFromState();
	   }
   }
};
   
/**
 * Return an object with all the values of the fields
 */
inputEx.Group.prototype.getValue = function() {
	var o = {};
	for (var i = 0 ; i < this.inputs.length ; i++) {
	   if(this.inputs[i].options.name) {
		   o[this.inputs[i].options.name] = this.inputs[i].getValue();
	   }
   }
	return o;
};
  
/**
 * Close the group (recursively calls "close" on each field, does NOT hide the group )
 * Call this function before hidding the group to close any field popup
 */
inputEx.Group.prototype.close = function() {
   for (var i = 0 ; i < this.inputs.length ; i++) {
 	      this.inputs[i].close();
   }
};

/**
 * Set the focus to the first input in the group
 */
inputEx.Group.prototype.focus = function() {
   if( this.inputs.length > 0 ) {
      this.inputs[0].focus();
   }
};
   
/**
 * Register this class as "group" type
 */
inputEx.registerType("group", inputEx.Group);
