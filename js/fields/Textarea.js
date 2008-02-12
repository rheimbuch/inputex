/**
 * Create a textarea input
 * Added options:
 * <ul>
 *	   <li>rows: rows attribute</li>
 *	   <li>cols: cols attribute</li>
 * </ul>
 *
 * @class inputEx.Textarea
 * @extends inputEx.Field
 */
inputEx.Textarea = function(options) {
	inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.Textarea, inputEx.Field, {
   
   setOptions: function() {
      inputEx.Textarea.superclass.setOptions.call(this);
      this.options.rows = this.options.rows || 6;
      this.options.cols = this.options.cols || 23;
   },
   
   renderComponent: function() {
      
      this.el = inputEx.cn('textarea', {
         value: this.options.value,
         rows: this.options.rows,
         cols: this.options.cols
      });
      
   	this.divEl.appendChild(this.el);
   }
   
});

/**
 * Register this class as "text" type
 */
inputEx.registerType("text", inputEx.Textarea);
