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
      
      this.options.calendar = this.options.calendar || inputEx.messages.defautCalendarOpts;
      this.options.readonly = true;
   },
   
   /**
    * Render the input field and the minical container
    */
   renderComponent: function() {
      
      inputEx.DatePickerField.superclass.renderComponent.call(this);
      
      
      // Create overlay
      this.oOverlay = new YAHOO.widget.Overlay(Dom.generateId(), { visible: false });
      this.oOverlay.setBody(" ");
      this.oOverlay.body.id = Dom.generateId();
      
      // Create button
      this.button = new YAHOO.widget.Button({ type: "menu", menu: this.oOverlay, label: "&nbsp;&nbsp;&nbsp;&nbsp;" });       
      this.button.appendTo(this.wrapEl);
            
      // Render the overlay
      this.oOverlay.render(this.wrapEl);
      
      // Subscribe to the first click
      this.button.on('click', this.renderCalendar, this, true);
   },

   
   /**
    * Called ONCE to render the calendar lazily
    */
   renderCalendar: function() {
      
      // Render the calendar
      var calendarId = Dom.generateId();
      this.calendar = new YAHOO.widget.Calendar(calendarId,this.oOverlay.body.id, this.options.calendar );
      
      // HACK: Set position absolute to the overlay
      Dom.setStyle(this.oOverlay.body.parentNode, "position", "absolute")
      
      /*
      this.calendar.cfg.setProperty("DATE_FIELD_DELIMITER", "/");
      this.calendar.cfg.setProperty("MDY_DAY_POSITION", 1);
      this.calendar.cfg.setProperty("MDY_MONTH_POSITION", 2);
      this.calendar.cfg.setProperty("MDY_YEAR_POSITION", 3);
      this.calendar.cfg.setProperty("MD_DAY_POSITION", 1);
      this.calendar.cfg.setProperty("MD_MONTH_POSITION", 2);*/

      // localization
      if(inputEx.messages.shortMonths) this.calendar.cfg.setProperty("MONTHS_SHORT", inputEx.messages.shortMonths);
      if(inputEx.messages.months) this.calendar.cfg.setProperty("MONTHS_LONG", inputEx.messages.months);
      if(inputEx.messages.weekdays1char) this.calendar.cfg.setProperty("WEEKDAYS_1CHAR", inputEx.messages.weekdays1char);
      if(inputEx.messages.shortWeekdays) this.calendar.cfg.setProperty("WEEKDAYS_SHORT", inputEx.messages.shortWeekdays);
      
      // HACK to keep focus on calendar/overlay 
      // so overlay is not hidden when changing page in calendar
      // (inspired by YUI examples)
      var focusDay = function () {

         var oCalendarTBody = Dom.get(calendarId).tBodies[0],
            aElements = oCalendarTBody.getElementsByTagName("a"),
            oAnchor;

         if (aElements.length > 0) {
         
            Dom.batch(aElements, function (element) {
               if (Dom.hasClass(element.parentNode, "today")) {
                  oAnchor = element;
               }
            });
            
            if (!oAnchor) {
               oAnchor = aElements[0];
            }

            // Focus the anchor element using a timer since Calendar will try 
            // to set focus to its next button by default
            
            YAHOO.lang.later(0, oAnchor, function () {
               try {
                  oAnchor.focus();
               }
               catch(e) {}
            });
         
         }
         
      };

      // Set focus to either the current day, or first day of the month in 
      // the Calendar when the month changes (renderEvent is fired)
      this.calendar.renderEvent.subscribe(focusDay, this.calendar, true);
      
      // Render the calendar
      this.calendar.render();
         
      // Set the field value when a date is selected
      this.calendar.selectEvent.subscribe(function (type,args,obj) {
         this.oOverlay.hide();
         var date = args[0][0];
         var year = date[0], month = date[1], day = date[2];
         this.setValue(new Date(year,month-1, day) );
         this.fireUpdatedEvt();
      }, this, true);
      
      // Unsubscribe the event so this function is called only once
      this.button.unsubscribe("click", this.renderCalendar); 
   }
   
});

inputEx.messages.defautCalendarOpts = { navigator: true };

/**
 * Register this class as "datepicker" type
 */
inputEx.registerType("datepicker", inputEx.DatePickerField);

})();