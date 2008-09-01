(function() {	
	var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
	
/**
 * @class Create a radio button. Here are the added options :
 * <ul>
 *    <li>choices: list of choices (array of string)</li>
 *    <li>allowAny: add an option with a string field</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.RadioField = function(options) {
	inputEx.RadioField.superclass.constructor.call(this,options);
};
	
lang.extend(inputEx.RadioField, inputEx.Field, 
/**
 * @scope inputEx.RadioField.prototype   
 */
{
	   
	/**
	 * Adds the Radio button specific options
	 */
	setOptions: function() {
	   
	   this.options.className = this.options.className || 'inputEx-Field inputEx-RadioField';
	   
	   inputEx.RadioField.superclass.setOptions.call(this);
	   
	   this.options.allowAny = lang.isUndefined(this.options.allowAny) ? false : this.options.allowAny;
	},
	   
	/**
	 * Render the checkbox and the hidden field
	 */
	renderComponent: function() {
	
	   this.optionEls = [];
	
	   for(var i = 0 ; i < this.options.choices.length ; i++) {
	
	      var div = inputEx.cn('div', {className: 'inputEx-RadioField-choice'});
	
	      var radio = inputEx.cn('input', { type: 'radio', name: this.options.name, value: this.options.choices[i] });
	      div.appendChild(radio);
	      
         this.label = inputEx.cn('label', {className: 'inputEx-RadioField-rightLabel'}, null, this.options.choices[i]);
      	div.appendChild(this.label);
      	
      	this.fieldContainer.appendChild( div );
      	
      	this.optionEls.push(radio);
     }
     
     // Build a "any" radio combined with a StringField
     if(this.options.allowAny) {
        this.radioAny = inputEx.cn('input', { type: 'radio', name: this.options.name });
	     this.fieldContainer.appendChild(this.radioAny);
	      
        this.anyField = new inputEx.StringField({});
        Dom.setStyle(this.radioAny, "float","left");
        Dom.setStyle(this.anyField.divEl, "float","left");
        this.anyField.disable();
     	  this.fieldContainer.appendChild(this.anyField.getEl());
     	  
     	  this.optionEls.push(this.radioAny);
     }
     
	},
	   
	/**
	 * Listen for change events on all radios
	 */
	initEvents: function() {
	   Event.addListener(this.optionEls, "change", this.onChange, this, true);
	   if(this.anyField)	{
	      this.anyField.updatedEvt.subscribe(function(e) {
	         inputEx.RadioField.superclass.onChange.call(this,e);
	      }, this, true);
	   }
	},
	   
	/**
	 * Function called when the checkbox is toggled
	 * @param {Event} e The original 'change' event
	 */
	onChange: function(e) {
	   // Enable/disable the "any" field
      if(this.radioAny) {
         if(this.radioAny == Event.getTarget(e) ) {
            this.anyField.enable();
            lang.later( 50 , this.anyField , "focus");
         }
         else {
            this.anyField.disable();
         }
      } 
	   inputEx.RadioField.superclass.onChange.call(this,e);
	},
	
	/**
	 * Get the state value
	 * @return {Any} 
	 */
	getValue: function() {
	   for(var i = 0 ; i < this.optionEls.length ; i++) {
	      if(this.optionEls[i].checked) {
	         if(this.radioAny && this.radioAny == this.optionEls[i]) {
	            var val = this.anyField.getValue();
	            return (val == '') ? null : val;
	         }
	         return this.options.choices[i];
	      }
	   }
	   return null;
	},
	
	/**
	 * Set the value of the checkedbox
	 * @param {Any} value The value schould be one of this.options.choices
	 */
	setValue: function(value) {
	   for(var i = 0 ; i < this.optionEls.length ; i++) {
	      this.optionEls[i].checked = (value == this.options.choices[i]);
	   }
	}
	
});   
	
/**
 * Register this class as "radio" type
 */
inputEx.registerType("radio", inputEx.RadioField);
	
})();