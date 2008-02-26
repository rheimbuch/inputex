/**
 * Handle a group of fields
 *
 * @class inputEx.Group
 * @constructor
 * @param {Array} inputConfigs Array of input fields : { label: 'Enter the value:' , type: 'text' or fieldClass: inputEx.Field, optional: true/false, inputParams: {inputparams object} }
 */
inputEx.Group = function(inputConfigs) {

   // Save the options locally
   this.inputConfigs = inputConfigs;
   
   /**
    * Array containing the list of the field instances
    */
   this.inputs = [];
   
   // Render the dom
   this.render();
   
	/**
	 * YAHOO custom event "updated"
	 */
	this.updatedEvt = new YAHOO.util.CustomEvent('updated', this);
	//this.updatedEvt.subscribe(function(e, params) { var value = params[0]; console.log("group updated",value); }, this, true);
   
   // Init the events
   this.initEvents();
};


inputEx.Group.prototype = {

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
  	   parentEl.appendChild(tableNonOptional);
  	  
  	   // Options: toggle the element
  	   if(tbodyOptional.childNodes.length > 0) {
 	      this.optionsLabel = inputEx.cn('div', {className: 'inputEx-Group-Options-Label inputEx-Group-Options-Label-Collapsed'});
 	      this.optionsLabel.appendChild( inputEx.cn('img', {src: inputEx.spacerUrl}) );
 	      this.optionsLabel.appendChild( inputEx.cn('span',null,null, "Options") );
 	      parentEl.appendChild(this.optionsLabel);
     	   parentEl.appendChild(this.tableOptional);
  	   }
  	   
   },
  
   /**
    * Instanciate one field given its parameters, type or fieldClass
    */
   renderField: function(input) {
      /**
   	 * Get the class for this field: if "type" is specified, we call inputEx.getFieldClass 
   	 * otherwise, we look for the "fieldClass" parameter.
   	 */
      var fieldClass = null;
   	if(input.type) {
   	   fieldClass = inputEx.getFieldClass(input.type);
   	   if(fieldClass === null) fieldClass = inputEx.Field;
   	}
   	else {
   	   fieldClass = input.fieldClass ? input.fieldClass : inputEx.Field;
   	}

      // Instanciate the field
      var inputInstance = new fieldClass(input.inputParams);
   	this.inputs.push(inputInstance);
   	
   	// Subscribe to the field "updated" event to send the group "updated" event
      inputInstance.updatedEvt.subscribe(this.onChange, this, true);
   	  
      return inputInstance;
   },
  
   /**
    * Init the events for the group
    */
   initEvents: function() {
      YAHOO.util.Event.addListener(this.optionsLabel, "click", this.onClickOptionsLabel, this, true);
   },
  
   /**
    * Handle the click on the "Options" label
    */
   onClickOptionsLabel: function() {
      if(this.tableOptional.style.display == 'none') {
         this.tableOptional.style.display = '';
         YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Collapsed", "inputEx-Group-Options-Label-Expanded");
      }
      else {
         this.tableOptional.style.display = 'none';
         YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Expanded", "inputEx-Group-Options-Label-Collapsed");
      }
   },
  
   /**
    * Return the group wrapper DIV element
    */
   getEl: function() {
      return this.divEl;
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
   	for (var i = 0 ; i < this.inputs.length ; i++) {
   		this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
   		this.inputs[i].setClassFromState();
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
    * Called when one of the field sent its "updated" event.
    */
   onChange: function() {
      
   	if(this.validate()) {
         // We already escaped the stack here so we can fire it directly
         var that = this;
         setTimeout(function() {that.updatedEvt.fire(that.getValue());}, 50);
      }
   }
   
};

