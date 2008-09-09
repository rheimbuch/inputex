(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class A DatePicker Field.
 * @extends inputEx.DateField
 * @constructor
 * @param {Object} options No added option for this field (same as DateField)
 */
inputEx.DatePickerField = function(options) {
	inputEx.DatePickerField.superclass.constructor.call(this,options);
};

lang.extend(inputEx.DatePickerField, inputEx.DateField, 
/**
 * @scope inputEx.DatePickerField.prototype   
 */   
{
   /**
    * Set the default date picker CSS classes
    */
   setOptions: function() {
	   this.options.className = this.options.className || 'inputEx-Field inputEx-DateField inputEx-DatePickerField';
   	inputEx.DatePickerField.superclass.setOptions.call(this);
   	
   	this.options.calendar = this.options.calendar || { navigator: true };
   	this.options.readonly = true;
   },
   
   /**
    * Render the input field and the minical container
    */
   renderComponent: function() {
      
      inputEx.DatePickerField.superclass.renderComponent.call(this);
      
      
      // Creation de l'overlay
      this.oOverlay = new YAHOO.widget.Overlay(Dom.generateId()/*, { visible: false }*/);
      this.oOverlay.setBody(" ");
      this.oOverlay.body.id = Dom.generateId();
      
      this.button = new YAHOO.widget.Button({ type: "menu", menu: this.oOverlay, label: "&nbsp;&nbsp;&nbsp;&nbsp;" });
      this.button._hideMenu = function () {
            if (this._menu) {
               if (this.preventHide) {
                 this._showMenu();
                 return;
               }
               this._menu.hide();
            }
       };
      this.button.appendTo(this.fieldContainer);
      this.button.appendTo(this.wrapEl);
      
      // Subscribe to the first click
      this.button.on('click', this.onButtonClick, this, true);
   },

   
   /**
    * Called ONCE to render the calendar lazily
    */
   onButtonClick: function() {
      
      // Render the overlay
      this.oOverlay.render(this.fieldContainer);
      
      // Render the calendar
      this.calendar = new YAHOO.widget.Calendar(Dom.generateId(),this.oOverlay.body.id, this.options.calendar );
      this.calendar.render();
         
      // Set the field value when a date is selected
      this.calendar.selectEvent.subscribe(function (type,args,obj) {
   	   this.oOverlay.hide();
      	var date = args[0][0];
      	var year = date[0], month = date[1], day = date[2];
      	this.setValue(new Date(year,month-1, day) );
      	this.fireUpdatedEvt();
      }, this, true);
      
      // HACK for not closing the calendar when changing page
   	this.calendar.changePageEvent.subscribe(function () {
   		this.button.preventHide = true;
         var that = this;
         window.setTimeout(function() {that.button.preventHide = false;},0);
   	}, this, true);
      
      // Unsubscribe the event so this function is called only once
      this.button.unsubscribe("click", this.onButtonClick); 
   }
   
});


/**
 * Register this class as "datepicker" type
 */
inputEx.registerType("datepicker", inputEx.DatePickerField);

})();