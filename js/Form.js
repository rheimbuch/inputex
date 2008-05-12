/**
 * @class Create a group of fields within a FORM tag
 * @extends inputEx.Group
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.Form = function(options) { 
   inputEx.Form.superclass.constructor.call(this, options);
};
YAHOO.extend(inputEx.Form, inputEx.Group);

/**
 * Adds buttons and set ajax default parameters
 */
inputEx.Form.prototype.setOptions = function() {
   inputEx.Form.superclass.setOptions.call(this);
   
   this.buttons = this.options.buttons;
   
   if(this.options.ajax) {
      this.options.ajax.method = this.options.ajax.method || 'POST';
      this.options.ajax.uri = this.options.ajax.uri || 'default.php';
      this.options.ajax.callback = this.options.ajax.callback || {};
      this.options.ajax.callback.scope = this.options.ajax.callback.scope || this;
   }
};
   
/**
 * Render the group
 */
inputEx.Form.prototype.render = function() {
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
};
   
/**
 * @method renderButtons
 * Render the buttons 
 */
inputEx.Form.prototype.renderButtons= function() {
		
	var button, buttonEl;
	for(var i = 0 ; i < this.buttons.length ; i++ ) {
	   button = this.buttons[i];
	   buttonEl = inputEx.cn('input', {type: button.type, value: button.value});
	   if( button.onClick ) { buttonEl.onclick = button.onClick; }
	   this.form.appendChild(buttonEl);
	}	
};
   
   
/**
 * Init the events
 */
inputEx.Form.prototype.initEvents = function() {
   inputEx.Form.superclass.initEvents.call(this);

   // Handle the submit event
   YAHOO.util.Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
};
   
/**
 * Intercept the 'onsubmit' event and stop it if !validate
 * If the ajax option object is set, use YUI async Request to send the form
 * @param {Event} e The original onSubmit event
 */
inputEx.Form.prototype.onSubmit = function(e) {
	if ( !this.validate() ) {
		YAHOO.util.Event.stopEvent(e);
	} 
	if(this.options.ajax) {
		YAHOO.util.Event.stopEvent(e);
	   this.asyncRequest();
	}
};
  
/**
 * Send the form value in JSON through an ajax request
 */
inputEx.Form.prototype.asyncRequest = function() { 
	//this.showMask();
	var postData = "value="+YAHOO.lang.JSON.stringify(this.getValue());
   YAHOO.util.Connect.asyncRequest(this.options.ajax.method, this.options.ajax.uri, { 
      success: function(o) {
         //this.hideMask();
         if( YAHOO.lang.isFunction(this.options.ajax.callback.success) ) {
            this.options.ajax.callback.success.call(this.options.ajax.callback.scope,o);
         }
      }, 
      
      failure: function(o) {
         //this.hideMask();
         if( YAHOO.lang.isFunction(this.options.ajax.callback.failure) ) {
            this.options.ajax.callback.failure.call(this.options.ajax.callback.scope,o);
         }
      }, 
      
      scope:this 
   }, postData);
};
  
/**
 * Create a Mask over the form
 *
inputEx.Form.prototype.renderMask = function() {
   if(this.maskRendered) return;
   
   YAHOO.util.Dom.setStyle(this.divEl, "position", "relative");
   this.formMask = inputEx.cn('div', {className: 'inputEx-Form-Mask'}, 
      {
         display: 'none', 
         width: YAHOO.util.Dom.getStyle(this.divEl,"width"),
         height: YAHOO.util.Dom.getStyle(this.divEl,"height"),
      }, 
      "<div/><center><br /><img src='../images/spinner.gif'/><br /><span>Envoi en cours...</span></center>");
   this.divEl.appendChild(this.formMask);
   this.maskRendered = true;
};*/

/**
 * Show the form mask
 *
inputEx.Form.prototype.showMask = function() {
   this.renderMask();
   this.formMask.style.display = '';
};
*/

/**
 * Hide the form mask
 *
inputEx.Form.prototype.hideMask = function() {
   this.formMask.style.display = 'none';
};*/


/**
* Register this class as "form" type
*/
inputEx.registerType("form", inputEx.Form);