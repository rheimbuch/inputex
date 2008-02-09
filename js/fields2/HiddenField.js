

/**
 * @class inputEx.HiddenField
 * Create a hidden input, inherits from inputEx.Field
 */
inputEx.HiddenField = function(options) {
	inputEx.HiddenField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.HiddenField, inputEx.Field);

inputEx.HiddenField.prototype.render = function() {
   this.type = inputEx.HiddenField;
	this.divEl = document.createElement('DIV');
	
	this.el = document.createElement('INPUT');
	this.el.type = 'hidden';
  this.el.name = this.options.name || '';

	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');
	
	this.divEl.appendChild(this.el);
};
