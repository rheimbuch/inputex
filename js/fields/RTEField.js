/**
 * Rich Text Editor
 *
 * @class inputEx.RTEField
 * @extends inputEx.Field
 */
inputEx.RTEField = function(options) {
   inputEx.RTEField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.RTEField, inputEx.Field, {
   
   render: function() {
      
      // Create a DIV element to wrap the editing el and the image
   	this.divEl = inputEx.cn('div', {className: this.options.className});
      
      this.el = inputEx.cn('textarea', {id: "msgpost"});
      this.divEl.appendChild(this.el);
      
      
      var myEditor = new YAHOO.widget.Editor("msgpost", {
          height: '300px',
          width: '522px',
          dompath: true
      });
      myEditor.render();
   }
   
});


/**
 * Register this class as "html" type
 */
inputEx.registerType("html", inputEx.RTEField);
