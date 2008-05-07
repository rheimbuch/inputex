/**
 * @class Wrapper for the Rich Text Editor from YUI
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.RTEField = function(options) {
   inputEx.RTEField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.RTEField, inputEx.Field);
   
/**
 * Render the field
 */
inputEx.RTEField.prototype.render = function() {
      
   // Create a DIV element to wrap the editing el and the image
   this.divEl = inputEx.cn('div', {className: this.options.className});
      
   if(!inputEx.RTEfieldsNumber) { inputEx.RTEfieldsNumber = 0; }
   var id = "inputEx-RTEField-"+inputEx.RTEfieldsNumber;
      
   this.el = inputEx.cn('textarea', {id: id});
   inputEx.RTEfieldsNumber += 1;
   this.divEl.appendChild(this.el);
      
   this.editor = new YAHOO.widget.Editor(id, {
       height: '300px',
       width: '522px',
       dompath: true
   });
   this.editor.render();
};

inputEx.RTEField.prototype.setValue = function(value) {
   if(this.editor)
      this.editor.setEditorHTML(value);
};


inputEx.RTEField.prototype.getValue = function() {
   try {
      return this.editor.getEditorHTML();
   }
   catch(ex) {}
};

/**
 * Register this class as "html" type
 */
inputEx.registerType("html", inputEx.RTEField);
