(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event;

/**
 * @class A DatePicker Field.
 * @extends inputEx.DateField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.DatePickerField = function(options) {
	inputEx.DatePickerField.superclass.constructor.call(this,options);
};

lang.extend(inputEx.DatePickerField, inputEx.DateField, 
/**
 * @scope inputEx.DatePickerField.prototype   
 */   
{
   
   setOptions: function() {
	   this.options.className = this.options.className || 'inputEx-DateField inputEx-DatePickerField';
   	inputEx.DatePickerField.superclass.setOptions.call(this);
   },
   
   /**
    * Render an 'INPUT' DOM node
    */
   renderComponent: function() {
      // Attributes of the input field
      var attributes = {};
      attributes.type = 'text';
      attributes.size = this.options.size;
      if(this.options.name) attributes.name = this.options.name;
   
      // Adds a readonly attribute
      attributes.readonly = 'readonly';
   
      // Create the node
      this.el = inputEx.cn('input', attributes);
	
      // Append it to the main element
      this.divEl.appendChild(this.el);
      
      
      this.minicalContainer = inputEx.cn('div');
      this.divEl.appendChild(this.minicalContainer);
   },
   
   
   initMinical : function() {
       var date = (this.value instanceof Date) ? this.value : new Date();
   	// Create a minical
   	
   	// Set the id of the dom element with a hack
   	if( !inputEx.DatePickerField.instanceNbr ) {
         inputEx.DatePickerField.instanceNbr = 0;
      }
      var id = 'minical-DatePickerField-'+inputEx.DatePickerField.instanceNbr;
      inputEx.DatePickerField.instanceNbr += 1;
      
   	this.minicalEl = new inputEx.widget.calendar(id,this.minicalContainer,{
   																calNumber:1,
   																calNbrLines:6,
   																autoCloseDelay:1000,
   																hideOnSelect:true,
   																selectedDate:date,
   																pageDate:date
   															});
      
      // Fire the event when a new date is clicked on the minical
      this.minicalEl.changeSelectedDatesEvent.subscribe(function(e,args) {
         this.setValue(args[0][0]);
      }, this, true);
   },

   initEvents : function() {
      inputEx.DatePickerField.superclass.initEvents.call(this);
      
      Event.addListener(this.el,'click',this.onClickField,this,true);
   },
   
   
   onClickField: function(e) {
      // Lazy initializing of minical
      if (!this.minicalEl) {
         this.initMinical();
      }
      
      if (this.value instanceof Date) {this.minicalEl.gotoDate(this.value);}

      this.minicalEl.toggle();
   }
   
});


/**
 * Register this class as "datepicker" type
 */
inputEx.registerType("datepicker", inputEx.DatePickerField);

})();