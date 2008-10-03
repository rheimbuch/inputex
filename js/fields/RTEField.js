(function() {
	
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;
	
/**
 * @class Wrapper for the Rich Text Editor from YUI
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options Added options:
 * <ul>
 *   <li>opts: the options to be added when calling the RTE constructor (see YUI RTE)</li>
 *   <li>type: if == 'simple', the field will use the SimpleEditor. Any other value will use the Editor class.</li>
 * </ul>
 */
inputEx.RTEField = function(options) {
   inputEx.RTEField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.RTEField, inputEx.Field, 
/**
 * @scope inputEx.RTEField.prototype   
 */  
{   
	/**
	 * Render the field using the YUI Editor widget
	 */	
	renderComponent: function() {
	   if(!inputEx.RTEfieldsNumber) { inputEx.RTEfieldsNumber = 0; }
	   var id = "inputEx-RTEField-"+inputEx.RTEfieldsNumber;
	      
	   this.el = inputEx.cn('textarea', {id: id});
	   inputEx.RTEfieldsNumber += 1;
	   this.fieldContainer.appendChild(this.el);
	
	   //If not set, set it to empty
	   if (!this.options.opts) {
	        this.options.opts = {};
	   }
	   //This is the default config
	   var _def = {
	       height: '300px',
	       width: '580px',
	       dompath: true
	   };
	   //The options object
	   var o = this.options.opts;
	   //Walk it to set the new config object
	   for (var i in o) {
	        if (lang.hasOwnProperty(o, i)) {
	            _def[i] = o[i];
	        }
	   }
	   //Check if options.type is present and set to simple, if it is use SimpleEditor instead of Editor
	   var editorType = ((this.options.type && (this.options.type == 'simple')) ? YAHOO.widget.SimpleEditor : YAHOO.widget.Editor);
	
	   //If this fails then the code is not loaded on the page
	   if (editorType) {
	       this.editor = new editorType(id, _def);
	       this.editor.render();
	   } else {
	    alert('Editor is not on the page');
	   }
	},
	
	/**
	 * Set the html content
	 * @param {String} value The html string
	 */
	setValue: function(value) {
	   if(this.editor)
	      this.editor.setEditorHTML(value);
	},
	
	/**
	 * Get the html string
	 * @return {String} the html string
	 */
	getValue: function() {
	   try {
	      return this.editor.getEditorHTML();
	   }
	   catch(ex) {}
	}
	
});
	
/**
 * Register this class as "html" type
 */
inputEx.registerType("html", inputEx.RTEField);
	
})();