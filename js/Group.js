

inputEx.Group = function(inputs) {
   
   // Save the options locally
   this.options = { inputs: inputs};
   
   // Render the dom
   this.render();
};


inputEx.Group.prototype = {
   
   getEl: function() {
      return this.divEl;
   },
   
   validate: function() {

   	// Validate all the sub fields
   	for (var i = 0 ; i < this.inputs.length ; i++) {
   		var input = this.inputs[i];
   		var state = input.getState();
   		if( state == inputEx.Field.stateRequired || state == inputEx.Field.stateInvalid ) {
   			return false;
   		}
      }
   	return true;
   },
   
   getValue: function() {
   	var o = {};
   	for (var i = 0 ; i < this.inputs.length ; i++) {
   		o[this.inputs[i].options.name] = this.inputs[i].getValue();
      }
   	return o;
   },
   
   enable: function(enable) {
      var disabled = !enable;
    	for (var i = 0 ; i < this.inputs.length ; i++) {
    	   var el = this.inputs[i].getEl();
    		el.disabled = disabled;
      }
   },
   
   setValue: function(oValues) { 
   	for (var i = 0 ; i < this.inputs.length ; i++) {
   		this.inputs[i].setValue(oValues[this.inputs[i].options.name] || '');
   		this.inputs[i].setClassFromState();
      }
   },
  
  render: function() {
   
     // Create the div wrapper for this group
  	  this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});

  	  // Array that will contain the references to the created Fields
     this.inputs = [];

     // Iterate this.createInput on input fields
     for (var i = 0 ; i < this.options.inputs.length ; i++) {
        
        var input = this.options.inputs[i];
        
        // Label element
        var labelEl = input.label ? inputEx.cn('div', {className: 'inputEx-Group-label'}, null, input.label) : null;
        
    	  // Create the new field with the given type as class
    	  if( !input.type ) input.type = inputEx.Field;

    	  var inputParams = {};
    	  for( var field in input.inputParams ) {
    	     if( input.inputParams.hasOwnProperty(field) ) {
    		      inputParams[field] = input.inputParams[field];
    		  }
    	  }
    		  
    	  this.inputs[i] = new input.type(inputParams);
    	  YAHOO.util.Dom.setStyle(this.inputs[i].getEl(), "display", "inline");
    	  
    	  if(!inputParams.required) {
    	      if(!this.optionsEl) {
       	      this.optionsEl = inputEx.cn('div', {className: "inputEx-Group-Options"}, {display: 'none'});
    	      }
    	      
            if(labelEl) { this.optionsEl.appendChild(labelEl); }
            this.optionsEl.appendChild( this.inputs[i].getEl() );
    	  }
    	  else {
           if(labelEl) { this.divEl.appendChild(labelEl); }
    	     this.divEl.appendChild( this.inputs[i].getEl() );
 	     }
  	   }
  	  
  	   // Options: toggle the element
  	   if(this.optionsEl) {
  	      
 	      this.optionsLabel = inputEx.cn('div', {className: 'inputEx-Group-Options-Label inputEx-Group-Options-Label-Collapsed'}, {cursor: 'pointer'});
 	      this.optionsLabel.appendChild( inputEx.cn('img', {src: inputEx.spacerUrl}) );
 	      this.optionsLabel.appendChild( inputEx.cn('span',null,null, "Options") );
 	      this.divEl.appendChild(this.optionsLabel);
 	      
 	      YAHOO.util.Event.addListener(this.optionsLabel, "click", function() { 
 	         if(this.optionsEl.style.display == 'none') {
 	            this.optionsEl.style.display = '';
 	            YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Collapsed", "inputEx-Group-Options-Label-Expanded");
 	         }
 	         else {
 	            this.optionsEl.style.display = 'none';
 	            YAHOO.util.Dom.replaceClass(this.optionsLabel, "inputEx-Group-Options-Label-Expanded", "inputEx-Group-Options-Label-Collapsed");
 	         }
 	         
 	      }, this, true);
 	      this.divEl.appendChild(this.optionsEl);
  	   }
  	  
  },
  
  close: function() {
     for (var i = 0 ; i < this.inputs.length ; i++) {
  	     this.inputs[i].close();
     }
  }
   
};

