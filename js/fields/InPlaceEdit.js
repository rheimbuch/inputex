/**
 * @class Meta field providing in place editing (the editor appears when you click on the formatted value). Options:
 * - formatDom
 * - formatValue
 * - ou texte...
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.InPlaceEdit = function(options) {
   inputEx.InPlaceEdit.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.InPlaceEdit, inputEx.Field);

/**
 * Override render to create 2 divs: the visualization one, and the edit in place form
 */
inputEx.InPlaceEdit.prototype.render = function() {
      
	// Create a DIV element to wrap the editing el and the image
	this.divEl = inputEx.cn('div', {className: this.options.className});
   	
   this.renderVisuDiv();
	   
	this.renderEditor();
};
   
/**
 * Render the editor
 */
inputEx.InPlaceEdit.prototype.renderEditor = function() {
      
   this.editorContainer = inputEx.cn('div', null, {display: 'none'});
      
   // Render the editor field
   this.editorField = inputEx.buildField(this.options.editorField);
   
   this.editorContainer.appendChild( this.editorField.getEl() );
   YAHOO.util.Dom.setStyle(this.editorField.getEl(), 'float', 'left');
      
   this.okButton = inputEx.cn('input', {type: 'button', value: 'Ok'});
   YAHOO.util.Dom.setStyle(this.okButton, 'float', 'left');
   this.editorContainer.appendChild(this.okButton);
      
   this.cancelLink = inputEx.cn('a', null, null, "cancel");
   this.cancelLink.href = ""; // IE required (here, not in the cn fct)
   YAHOO.util.Dom.setStyle(this.cancelLink, 'float', 'left');
   this.editorContainer.appendChild(this.cancelLink);
      
   // Line breaker
   this.editorContainer.appendChild( inputEx.cn('div',null, {clear: 'both'}) );
      
   this.divEl.appendChild(this.editorContainer);
};
      
inputEx.InPlaceEdit.prototype.onVisuMouseOver = function() {
   if(this.colorAnim) {
      this.colorAnim.stop(true);
   }
   inputEx.sn(this.formattedContainer, null, {backgroundColor: '#eeee33' });
};
   
inputEx.InPlaceEdit.prototype.onVisuMouseOut = function() {
   // Start animation
   if(this.colorAnim) {
      this.colorAnim.stop(true);
   }
   this.colorAnim = new YAHOO.util.ColorAnim(this.formattedContainer, {backgroundColor: { from: '#eeee33' , to: '#eeeeee' }}, 1);
   this.colorAnim.onComplete.subscribe(function() { YAHOO.util.Dom.setStyle(this.formattedContainer, 'background-color', ''); }, this, true);
   this.colorAnim.animate();
};
   
/**
 * Create the div that will contain the visualization of the value
 */
inputEx.InPlaceEdit.prototype.renderVisuDiv = function() {
   this.formattedContainer = inputEx.cn('div', {className: 'inputEx-InPlaceEdit-formattedContainer'});
      
   if( YAHOO.lang.isFunction(this.options.formatDom) ) {
      this.formattedContainer.appendChild( this.options.formatDom(this.options.value) );
   }
   else if( YAHOO.lang.isFunction(this.options.formatValue) ) {
      this.formattedContainer.innerHTML = this.options.formatValue(this.options.value);
   }
   else {
      this.formattedContainer.innerHTML = YAHOO.lang.isUndefined(this.options.value) ? inputEx.messages.emptyInPlaceEdit: this.options.value;
   }
      
   this.divEl.appendChild(this.formattedContainer);
};
   
inputEx.InPlaceEdit.prototype.initEvents = function() {  
   YAHOO.util.Event.addListener(this.formattedContainer, "click", this.openEditor, this, true);
            
   // For color animation
   YAHOO.util.Event.addListener(this.formattedContainer, 'mouseover', this.onVisuMouseOver, this, true);
   YAHOO.util.Event.addListener(this.formattedContainer, 'mouseout', this.onVisuMouseOut, this, true);
         
   // Editor: 
   YAHOO.util.Event.addListener(this.okButton, 'click', this.onOkEditor, this, true);
   YAHOO.util.Event.addListener(this.cancelLink, 'click', this.onCancelEditor, this, true);
         
   if(this.editorField.el) {
      // Register some listeners
      YAHOO.util.Event.addListener(this.editorField.el, "keyup", this.onKeyUp, this, true);
      YAHOO.util.Event.addListener(this.editorField.el, "keydown", this.onKeyDown, this, true);
      // BLur
      YAHOO.util.Event.addListener(this.editorField.el, "blur", this.onCancelEditor, this, true);
   }
};
   
inputEx.InPlaceEdit.prototype.onKeyUp = function(e) {
   // Enter
   if( e.keyCode == 13) {
      this.onOkEditor();
   }
   // Escape
   if( e.keyCode == 27) {
      this.onCancelEditor(e);
   }
};
   
inputEx.InPlaceEdit.prototype.onKeyDown = function(e) {
   // Tab
   if(e.keyCode == 9) {
      this.onOkEditor();
   }
};
   
inputEx.InPlaceEdit.prototype.onOkEditor = function() {
   var newValue = this.editorField.getValue();
   this.setValue(newValue);
      
   this.editorContainer.style.display = 'none';
   this.formattedContainer.style.display = '';
      
   var that = this;
   setTimeout(function() {that.updatedEvt.fire(newValue);}, 50);      
};
   
inputEx.InPlaceEdit.prototype.onCancelEditor = function(e) {
   YAHOO.util.Event.stopEvent(e);
   this.editorContainer.style.display = 'none';
   this.formattedContainer.style.display = '';
};
   
   
inputEx.InPlaceEdit.prototype.openEditor = function() {
   var value = this.getValue();
   this.editorContainer.style.display = '';
   this.formattedContainer.style.display = 'none';
   
   if(!YAHOO.lang.isUndefined(value)) {
      this.editorField.setValue(value);   
   }
      
   // Set focus in the element !
   if(this.editorField.el && YAHOO.lang.isFunction(this.editorField.el.focus) ) {
      this.editorField.el.focus();
   }
   
   // Select the content
   if(this.editorField.el && YAHOO.lang.isFunction(this.editorField.el.setSelectionRange) && (!!value && !!value.length)) {
      this.editorField.el.setSelectionRange(0,value.length);
   }
      
};
   
inputEx.InPlaceEdit.prototype.getValue = function() {
	return this.value;
};


inputEx.InPlaceEdit.prototype.setValue = function(value) {
      
   // Store the value
	this.value = value;
   	
   if(YAHOO.lang.isUndefined(value) || value == "") {
      this.value = "(Edit me)";
   }
   	
	// TODO: Display Value only 
   if(YAHOO.lang.isFunction(this.options.formatDom)) {
      this.formattedContainer.innerHTML = "";
      this.formattedContainer.appendChild( this.options.formatDom(this.value) );
   }
   else if( YAHOO.lang.isFunction(this.options.formatValue) ) {
      this.formattedContainer.innerHTML = this.options.formatValue(this.value);
   }
   else {
      this.formattedContainer.innerHTML = this.value;
   }
};
  
inputEx.messages.emptyInPlaceEdit = "(click to edit)";

/**
 * Register this class as "inplaceedit" type
 */
inputEx.registerType("inplaceedit", inputEx.InPlaceEdit);

