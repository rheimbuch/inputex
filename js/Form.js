/**
 * Create a group of fields within a FORM tag
 *
 * @class inputEx.Form
 * @extends inputEx.Group
 * @constructor
 * 
 */
inputEx.Form = function(inputConfigs, buttons, options) {

  // Save the options locally
  this.buttons = buttons || [];

  inputEx.Form.superclass.constructor.call(this, inputConfigs);
  
};


YAHOO.extend(inputEx.Form, inputEx.Group, {
   
   
   /**
    * Render the group
    */
   render: function() {
   
      // Create the div wrapper for this group
  	   this.divEl = inputEx.cn('div', {className: 'inputEx-Group'});
  	   
  	   // Create the FORM element
   	this.form = inputEx.cn('form', {method: this.options.method || 'POST', action: this.options.action || '', className: this.options.className || 'inputEx-Form'});
   	this.divEl.appendChild(this.form);

   	// Set the autocomplete attribute to off to disable firefox autocompletion
   	this.form.setAttribute('autocomplete','off');
   	
   	// Set the name of the form
   	if(this.options.formName) { this.form.name = this.options.formName; }
  	   
  	   this.renderFields(this.form);

   	this.renderButtons();	  
   },
   
   /**
    * @method renderButtons
    * Render the buttons 
    */
   renderButtons: function() {
		
	   var button, buttonEl;
	   for(var i = 0 ; i < this.buttons.length ; i++ ) {
		   button = this.buttons[i];
		   buttonEl = inputEx.cn('input', {type: button.type, value: button.value});
		   if( button.onClick ) { buttonEl.onclick = button.onClick; }
		   this.form.appendChild(buttonEl);
	   }	
   },
   
   
   /**
    * Init the events
    */
   initEvents: function() {

      inputEx.Form.superclass.initEvents.call(this);

      // Handle the submit event
      YAHOO.util.Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
   },
   

   /**
    * @method onSubmitForm
    * Intercept the 'onsubmit' event and stop it if !validate
    */
   onSubmit: function(e) {
   	if ( !this.validate() ) {
   		YAHOO.util.Event.stopEvent(e);
   	} 
   }
   
});

