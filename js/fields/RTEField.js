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

   //If not set, set it to empty
   if (!this.options.opts) {
        this.options.opts = {};
   }
   //This is the default config
   var _def = {
       height: '300px',
       width: '522px',
       dompath: true
   };
   //The options object
   var o = this.options.opts;
   //Walk it to set the new config object
   for (var i in o) {
        if (YAHOO.lang.hasOwnProperty(o, i)) {
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
