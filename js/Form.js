(function () {
   
var util = YAHOO.util, lang = YAHOO.lang, Event = YAHOO.util.Event, inputEx = YAHOO.inputEx, Dom = util.Dom;
   
/**
 * @class Create a group of fields within a FORM tag
 * @extends inputEx.Group
 * @constructor
 * @param {Object} options The following options are added for Forms:
 * <ul>
 *   <li>buttons: list of button definition objects {value: 'Click Me', type: 'submit'}</li>
 *   <li>ajax: send the form through an ajax request (submit button should be present): {method: 'POST', uri: 'myScript.php', callback: same as YAHOO.util.Connect.asyncRequest callback}</li>
 *   <li>showMask: adds a mask over the form while the request is running (default is false)</li>
 * </ul>
 */
inputEx.Form = function(options) { 
   inputEx.Form.superclass.constructor.call(this, options);
};

lang.extend(inputEx.Form, inputEx.Group, 
/**
 * @scope inputEx.Form.prototype   
 */
{

   /**
    * Adds buttons and set ajax default parameters
    */
   setOptions: function() {
      inputEx.Form.superclass.setOptions.call(this);
   
      this.buttons = [];
      
      this.options.buttons = this.options.buttons || [];
   
      if(this.options.ajax) {
         this.options.ajax.method = this.options.ajax.method || 'POST';
         this.options.ajax.uri = this.options.ajax.uri || 'default.php';
         this.options.ajax.callback = this.options.ajax.callback || {};
         this.options.ajax.callback.scope = this.options.ajax.callback.scope || this;
         this.options.ajax.showMask = lang.isUndefined(this.options.ajax.showMask) ? false : this.options.ajax.showMask;
      }
   },
   
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
      
      if(this.options.disabled) {
  	      this.disable();
  	   }	  
   },
   
   /**
    * Render the buttons 
    */
   renderButtons: function() {
      
      this.buttonDiv = inputEx.cn('div', {className: 'inputEx-Form-buttonBar'});
		
	   var button, buttonEl;
	   for(var i = 0 ; i < this.options.buttons.length ; i++ ) {
	      button = this.options.buttons[i];
	      buttonEl = inputEx.cn('input', {type: button.type, value: button.value});
	      if( button.onClick ) { buttonEl.onclick = button.onClick; }
	      this.buttons.push(buttonEl);
	      this.buttonDiv.appendChild(buttonEl);
	   }	
	   
	   this.form.appendChild(this.buttonDiv);
   },
   
   
   /**
    * Init the events
    */
   initEvents: function() {
      inputEx.Form.superclass.initEvents.call(this);

      // Handle the submit event
      Event.addListener(this.form, 'submit', this.options.onSubmit || this.onSubmit,this,true);
   },
   
   /**
    * Intercept the 'onsubmit' event and stop it if !validate
    * If the ajax option object is set, use YUI async Request to send the form
    * @param {Event} e The original onSubmit event
    */
   onSubmit: function(e) {
	   if ( !this.validate() ) {
		   Event.stopEvent(e);
	   } 
	   if(this.options.ajax) {
		   Event.stopEvent(e);
	      this.asyncRequest();
	   }
   },
  
   /**
    * Send the form value in JSON through an ajax request
    */
   asyncRequest: function() { 
      
      if(this.options.ajax.showMask) { this.showMask(); }
	   var postData = "value="+lang.JSON.stringify(this.getValue());
      util.Connect.asyncRequest(this.options.ajax.method, this.options.ajax.uri, { 
         success: function(o) {
            if(this.options.ajax.showMask) { this.hideMask(); }
            if( lang.isFunction(this.options.ajax.callback.success) ) {
               this.options.ajax.callback.success.call(this.options.ajax.callback.scope,o);
            }
         }, 
      
         failure: function(o) {
            if(this.options.ajax.showMask) { this.hideMask(); }
            if( lang.isFunction(this.options.ajax.callback.failure) ) {
               this.options.ajax.callback.failure.call(this.options.ajax.callback.scope,o);
            }
         }, 
      
         scope:this 
      }, postData);
   },
  
   /**
    * Create a Mask over the form
    */
   renderMask: function() {
      if(this.maskRendered) return;
   
      Dom.setStyle(this.divEl, "position", "relative");
      this.formMask = inputEx.cn('div', {className: 'inputEx-Form-Mask'}, 
         {
            display: 'none', 
            width: Dom.getStyle(this.divEl,"width"),
            height: Dom.getStyle(this.divEl,"height")
         }, 
         "<div/><center><br /><img src='../images/spinner.gif'/><br /><span>Envoi en cours...</span></center>");
      this.divEl.appendChild(this.formMask);
      this.maskRendered = true;
   },

   /**
    * Show the form mask
    */
   showMask: function() {
      this.renderMask();
      this.formMask.style.display = '';
   },

   /**
    * Hide the form mask
    */
   hideMask: function() {
      this.formMask.style.display = 'none';
   },
   
   
   /**
    * Enable all fields and buttons in the form
    */
   enable: function() {
      inputEx.Form.superclass.enable.call(this);
      for (var i = 0 ; i < this.buttons.length ; i++) {
 	      this.buttons[i].disabled = false;
      }
   },
   
   /**
    * Disable all fields and buttons in the form
    */
   disable: function() {
      inputEx.Form.superclass.disable.call(this);
      for (var i = 0 ; i < this.buttons.length ; i++) {
 	      this.buttons[i].disabled = true;
      }
   },

});

/**
* Register this class as "form" type
*/
inputEx.registerType("form", inputEx.Form);


})();


