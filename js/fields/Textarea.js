/**
 * @class Create a textarea input
 * Added options:
 * <ul>
 *	   <li>rows: rows attribute</li>
 *	   <li>cols: cols attribute</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.Textarea = function(options) {
	inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.Textarea, inputEx.Field);


inputEx.Textarea.prototype.initEvents = function() {
   YAHOO.util.Event.addListener(this.el, "change", this.onChange, this, true);
};

inputEx.Textarea.prototype.setOptions = function() {
   inputEx.Textarea.superclass.setOptions.call(this);
   this.options.rows = this.options.rows || 6;
   this.options.cols = this.options.cols || 23;
};
   
inputEx.Textarea.prototype.renderComponent = function() {      
   this.el = inputEx.cn('textarea', {
      rows: this.options.rows,
      cols: this.options.cols
   }, null, this.options.value);
      
   this.divEl.appendChild(this.el);
};

inputEx.Textarea.prototype.setValue = function(value) {
   this.el.value = value;
};

inputEx.Textarea.prototype.getValue = function() {
   return this.el.value;
};

/**
 * Register this class as "text" type
 */
inputEx.registerType("text", inputEx.Textarea);
