(function() {
   
   var inputEx = YAHOO.inputEx,Event = YAHOO.util.Event, Dom = YAHOO.util.Dom, Y = YAHOO.util;
  
/**
 * @namespace Date Extensions for the calendar widget
 */ 
inputEx.widget.DateEx = {};

Y.lang.augmentObject(inputEx.widget.DateEx, 
/**
 * @scope inputEx.widget.DateEx
 */
{   
   /** 
    * Return today's date (at midnight)
    * @return {Date} today's date
    */
   getToday: function() { 
      return this.getMidnight(new Date()); 
   },
   
   /** 
    * Return today's date (at midnight)
    * @param {Date} d Date to convert
    * @return {Date} date at midnight
    */
   getMidnight: function(d) { 
      return new Date( d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0); 
   },
   
   /** 
    * Add N days to a date
    * @param {Date} d Date to start from
    * @param {int} amount Number of days to add
    * @return {Date} date+N days
    */
   AddDays: function(date, amount) {
      var d = new Date(date.getTime());
      d.setDate(date.getDate() + amount);
      return d;
   },
   
   /** 
    * Add N weeks to a date
    * @param {Date} d Date to start from
    * @param {int} amount Number of weeks to add
    * @return {Date} date+N weeks
    */
   AddWeeks: function(date, amount) { 
      return this.AddDays(date, 7*amount); 
   },
   
   /** 
    * Add N months to a date
    * @param {Date} d Date to start from
    * @param {int} amount Number of months to add
    * @return {Date} date+N months
    */
   AddMonths: function(date, amount) {
      var d = new Date(date.getTime());
      var newMonth = d.getMonth() + amount;
   	var years = 0;
   	if (newMonth < 0) {
   		while (newMonth < 0) {
   			newMonth += 12;
   			years -= 1;
   		}
   	} else if (newMonth > 11) {
   		while (newMonth > 11) {
   			newMonth -= 12;
   			years += 1;
   		}
   	}
   	d.setMonth(newMonth);
   	d.setFullYear(d.getFullYear() + years);
   	return d;
   },
   
   /** 
    * Get the previous monday
    * @param {Date} date Date to start from
    * @return {Date} last monday
    */
   GetMonday: function(date)  {
      var diffdays = 1-date.getDay(); 
      if(diffdays == 1) { diffdays = -6; }
      var monday = this.AddDays(date,diffdays);
      var ret = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() );
      return ret;
   },
   
   /** 
    * Return the first day of the month
    * @param {Date} date Date to start from
    * @return {Date} first day of month
    */
   findMonthStart: function(date) {
      var start = new Date(date.getFullYear(), date.getMonth(), 1);
   	return start;
   },
   
   /** 
    * Return the last day of the month
    * @param {Date} date Date to start from
    * @return {Date} last day of month
    */
   findMonthEnd: function(date) {
   	var start = this.findMonthStart(date);
   	var nextMonth = this.AddMonths(start,1);
   	var end = this.AddDays(nextMonth,-1);
   	return end;
   }
   
});

var dateEx = inputEx.widget.DateEx;


/**
 * inputEx.widget.calendar is used to display a popup to select dates.  This popup shows 1 to n calendars,
 * each one representing a month. Week days can be allowed or disabled for the selection. Selection
 * is performed on consecutive allowed days within the same calendar. calendar returns an array of
 * selected dates as param attached to event "changeSelectedDates".
 * 
 * @class inputEx.widget.calendar
 * @constructor
 * @param {String} id  The id attributed to the future constructed calendar
 * @param {String} container  The dom element of the container (typically a div) to render the calendar
 * @param {Object} config Optional. The config objet to override specific defaultConfig properties
 */

inputEx.widget.calendar = function(id, container, options) {
	 
	 this.id = id;
 
    this.setOptions(options);
    
    this.render(id,container);
    
    this.initEvents();
 
    this.updateSelectedDates();

    this.update();

    this.visible = false;
};

inputEx.widget.calendar.prototype = {

   /**
    * Add config properties to calendar, provided by _config parameter or default config.
    * @param {Object} options Optional. The config objet to override specific defaultConfig properties
    */
   setOptions : function(options) {
   
      var config = options || {};
   
      this.cfgPageDate = (config.pageDate) ? dateEx.findMonthStart(config.pageDate) : dateEx.findMonthStart(new Date()); // reference date for displaying cals (if = "13 november 2007" and calNumber = 2, then save "1st november 2007" and  display 2 cals : november 2007 and december 2007) 
      this.cfgCalNumber = config.calNumber || 2; // from 1 to N
      this.cfgCalNbrLines = config.calNbrLines || 6; // should be >= 6
      this.cfgNumberOfDatesToSelect = config.numberOfDatesToSelect || 1;  // number of consecutive allowed dates to select from selected date
      this.cfgNavigationType = config.navigationType || 'sameAsNODTS'; // or '1by1' : config of default number of dates to skip when getting previous or next Dates (may be same as numberOfDatesToSelect, or '1by1' if navigation day by day, ...)
      this.cfgAutoCloseDelay = config.autoCloseDelay || 1500;  // auto-close panel after * ms if mouse out of panel
      this.cfgHideOnSelect = YAHOO.lang.isUndefined(config.hideOnSelect) ? true : config.hideOnSelect;
      this.cfgHideOnSelectDelay = config.hideOnSelectDelay || 200;  // auto-close panel after * ms if selection made
   
      // this.lastSelection = {date:...,id:...}  keeps last selection in calendar (date and id of clicked cell if selection through clicking.
      this.lastSelection = {};
      this.lastSelection.date = config.selectedDate || dateEx.getToday();
   },


   /**
    * Perform dom node creation : create the main panel of calendar and its calendars
    * @param {String} id  The id attributed to the future constructed calendar
    * @param {String} container  The dom element of the container (typically a <div />) to render the calendar
    */
   render : function(id,container) {
      this.panel_container = container;
      inputEx.sn(this.panel_container,{className:'inputEx-Calendar'}); 
   
      // Calculate panel width and height
      var width = ((this.cfgCalNumber*147)+12);
      if (this.cfgCalNumber>3) {width-=2;}
      var height = 38+this.cfgCalNbrLines*17;
   
      // Create panel with dom for calendars
      this.panel = inputEx.cn('div',{id: id, className:'inputEx-Calendar-inner-container'}, {width:width+'px', height:height+'px'});
      this.panel.appendChild(this.initCals());
      
      // Create div for shadow to wrap div with content (hidden at beginning)
      this.shadow_container = inputEx.cn('div',{id: id, className:'inputEx-Calendar-outer-container'}, {display:'none'});
   
      this.shadow_container.appendChild(this.panel);   
      this.panel_container.appendChild(this.shadow_container);
   },
   

   /**
    * Create custom events used within calendar or to communicate with other widgets, and
    * add some listeners to them.
    */ 
   initEvents : function() {
      // "Private" events : for calendar intern use
	   this.changePageEvent = new Y.CustomEvent("changePage");
   
      // "Private" listeners
	   this.changePageEvent.subscribe(this.onChangePage, this, true);
   
      // "Public" event : inform everyone that a new selection has been completed !  (no intern listener)
	   this.changeSelectedDatesEvent = new Y.CustomEvent("changeSelectedDates");
   
      // Listen if mouse away from calendar too long
      //     WARNING : this.panel must be rendered before the following code is executed (<div id='this.id' /> is instantiated through panel rendering)
      Event.addListener(this.shadow_container,'mouseout',this.onMinicalMouseOut,this,true);
      Event.addListener(this.shadow_container,'mouseover',this.onMinicalMouseOver,this,true);

      // Disable any text selection when dragging with mousedown on minical
      Event.addListener(this.shadow_container,'mousedown',function (e) {e.preventDefault();});
   },


   /**
    * Creates dom for the requested number of calendars to display (1 month = 1 cal) and return
    * them in a list (<ul /> node).
    * @return {domNode} ul Dom node 'ul' : list of calendars
    */
   initCals : function() {
      var ul, li, i;
      ul = inputEx.cn('ul',{className:'inputEx-Calendar-cal-list'});
      for (i=0; i<this.cfgCalNumber;i++) {
         li = inputEx.cn('li');
         li.appendChild(this.initCal(i));
         ul.appendChild(li);
      }
      return ul;
   },


   /**
    * Creates dom for one calendar, represented by its 'cal_position'
    * @param {Number} cal_position  The position of the calendar in the panel : 0 for the calendar on the left, and 1, 2, ..., n for the others from left to right
    * @return {domNode} table Dom node 'table' : one calendar
    */
   initCal : function(cal_position) {
      var table = inputEx.cn('table',{id:this.id+"_cal_"+cal_position,className:'inputEx-Calendar-cal'});
      var thead = this.initCalHeader(cal_position);
      var tbody = this.initCalBody(cal_position);
      table.appendChild(thead);
      table.appendChild(tbody);
      return table;
   },

   /**
    * Creates dom header for one calendar. This header contains week days labels ('Mo','Tu', ...) and navigation links for 'side' calendars.
    * This function does NOT display label for month and year : this.updateMonthHeader performs this.
    * @param {Number} cal_position  The position of the calendar in the panel : 0 for the calendar on the left, and 1, 2, ..., n for the others from left to right
    * @return {domNode} thead Dom node 'thead' : header for one calendar
    */
   initCalHeader : function(cal_position) {
      var thead = inputEx.cn('thead');
   
      // Add top line 
      var tr_top = inputEx.cn('tr');
      var th_top = inputEx.cn('th',{className:'calhead',colSpan:7});
      var div = inputEx.cn('div',{className:'calheader cal_'+cal_position});
      tr_top.appendChild(th_top);
      th_top.appendChild(div);
   
      // Add left navigation link if first cal
      var navLeftLink, navRightLink;
      if (cal_position===0) {
         navLeftLink= inputEx.cn('a',{className:'calnavleft',title:inputEx.messages.calendarNavLeft},null,'&nbsp;&nbsp;&nbsp;&nbsp;');
         div.appendChild(navLeftLink);
         Event.addListener(navLeftLink,'mousedown',this.previousPage,this,true);
      }
   
      // Add cal title (empty)
      var textSpan = inputEx.cn('span',{className:'caltitle_'+cal_position});
      div.appendChild(textSpan);
   
      // Add right navigation link if first cal
      if (cal_position===(this.cfgCalNumber-1)) {
         navRightLink = inputEx.cn('a',{className:'calnavright',title:inputEx.messages.calendarNavRight},null,'&nbsp;&nbsp;&nbsp;&nbsp;');
         div.appendChild(navRightLink);
         Event.addListener(navRightLink,'mousedown',this.nextPage,this,true);
      }
   
      // Add labels for week days (and listen for click).
      var tr_bottom = inputEx.cn('tr',{className:'calweekdayrow'});
      for (var i=0;i<7;i++) {
         var th_bottom = inputEx.cn('th',{className:'calweekdaycell'},null, inputEx.messages.dayNames[i].substr(0,2));
         tr_bottom.appendChild(th_bottom);
      }
   
      thead.appendChild(tr_top);
      thead.appendChild(tr_bottom);
   
      return thead;
   },


   /**
    * Creates dom tbody for one calendar. This function does NOT display dates (empty cells) : this.updateCalBody performs this.
    * Initialize listeners on tbody to perform dates selection.
    * @param {Number} cal_position  The position of the calendar in the panel : 0 for the calendar on the left, and 1, 2, ..., n for the others from left to right
    * @return {domNode} tbody Dom node 'tbody' : body for one calendar
    */
   initCalBody : function(cal_position) {
      var tbody = inputEx.cn('tbody',{className:"calbody"});
      var tr, td, id, j, i;
      for (j=0;j<this.cfgCalNbrLines;j++) {
         tr = inputEx.cn('tr');
         for (i=0;i<7;i++) {
            id = this.id+'-calcell_'+cal_position+'_'+j+'_'+i;
            td = inputEx.cn('td',{id:id});
            tr.appendChild(td);
         }
         tbody.appendChild(tr);
      }
   
      Event.addListener(tbody,"mousedown",this.onCellClick,this,true); 
    
      return tbody;
   },




 /*
 ***************************************************************************************
 *  Update functions : called to feed calendars' headers and bodies with data.
 *      (only populate Dom nodes with data, but no node creation)
 ***************************************************************************************
 */
 
   /**
    * Perform a global update of all calendars displays
    */
   update : function() {
      for (var i=0;i<this.cfgCalNumber;i++) {
         this.updateMonthHeader(i);
         this.updateBody(i);
      }
      this.markSelectedCell();
   },

   /**
    * Displays label for month and year in one single calendar.
    * @param {Number} cal_position  The position of the calendar in the panel : 0 for the calendar on the left, and 1, 2, ..., n for the others from left to right
    */
   updateMonthHeader : function(cal_position) {
      // workingDate : date of first day of month
      var workingDate = dateEx.AddMonths(this.cfgPageDate,cal_position);
   
      var textMonth = inputEx.messages.monthNames[workingDate.getMonth()]+' '+workingDate.getFullYear();
      var headerTitle = Dom.getElementsByClassName('caltitle_'+cal_position,'span',this.id);
      headerTitle[0].innerHTML = textMonth;
   },


   /**
    * Display dates in one single calendar body.
    * @param {Number} cal_position  The position of the calendar in the panel : 0 for the calendar on the left, and 1, 2, ..., n for the others from left to right
    */
   updateBody : function(cal_position) {
      // Hack when we are on 31 of august for instance : findMonthStart executed before adding month 
      var calDate = dateEx.AddMonths(this.cfgPageDate,cal_position);
      var startMonthDate = dateEx.findMonthStart(calDate);
      var endMonthDate = dateEx.findMonthEnd(calDate);
   
      // startMonthDayNumber : offset for the first date of the month (how many cells before cell of first date of the month)
      var startMonthDayNumber = startMonthDate.getDay();
      if (startMonthDayNumber === 0) {startMonthDayNumber = 7;} // Sunday should return 7 instead of 0
   
      // startCalDate : date of the first cell of the body (not necessarily first date of month).
      var startCalDate = dateEx.AddDays(startMonthDate, 1-startMonthDayNumber);
   
      var today = new Date();
   
      var tbody = Dom.getElementsByClassName('calbody','tbody',this.id)[cal_position];
      var lines = tbody.childNodes;
      var tr, cells, td_cell, cell_date, cell_index;
      var i, j;
      for (i=0;i<this.cfgCalNbrLines;i++) {
         tr = lines[i];
         cells = tr.childNodes;
         for (j=0;j<7;j++) {
            td_cell = cells[j];
            cell_index = i*7+j;
            cell_date = dateEx.AddDays(startCalDate,cell_index);
            td_cell.innerHTML = cell_date.getDate();
         
            // Check if today
            if (cell_date.getDate() === today.getDate() && cell_date.getMonth() === today.getMonth() && cell_date.getYear() === today.getYear()) {
               Dom.addClass(td_cell,'today');
            } else {
               Dom.removeClass(td_cell,'today');
            }
         
            // Check if day out of month (oom)
            if (i===0 && j<startMonthDayNumber-1) {
               Dom.addClass(td_cell,'oom');
            } else if (cell_index>startMonthDayNumber+endMonthDate.getDate()-2) {
               Dom.addClass(td_cell,'oom');
            } else {
               Dom.removeClass(td_cell,'oom');
            }      
         }
      }
   },


   /**
    * Event handler for page changing. Remove any cell selection and update calendars (months/dates).
    */
   onChangePage : function() {
	   this.update();
   },

 /*
 *********************************************************************************************************
 *  Date selection functions :
 *    - intercept mouse click to perform single-cell selection !
 *    - return selected dates in an array through event "changeSelectedDates" firing
 *********************************************************************************************************
 */

   onCellClick : function(e) {
      var selectedCell = Event.getTarget(e);
	
	   var selectedCellId = selectedCell.id;
      this.updateLastSelection(selectedCellId);
	 
	   // update marked cells
      this.markSelectedCell();
	 
	   // Hide panel 
      if (this.cfgHideOnSelect) {
         YAHOO.lang.later( this.cfgHideOnSelectDelay, this, this.hide);
      }
	 
	   // Update selected dates in memory
      this.updateSelectedDates();
   },


   /**
    * Update all calendars' cells to display new selection
    */
   markSelectedCell : function() {
      // If there is a selection
      if (this.lastSelection && this.lastSelection.date) {
         var startFirstCalDate = this.cfgPageDate;
         var endLastMonthDate = dateEx.findMonthEnd(dateEx.AddMonths(startFirstCalDate, this.cfgCalNumber));
      
         var calDate, startMonthDate, endMonthDate, startMonthDayNumber, startCalDate, cellDate, selectedDate;
      
         var tbodies = Dom.getElementsByClassName('calbody','tbody',this.id);
         var i, j, k;
         var lines, cells, tr, td;
         for (i=0; i<tbodies.length; i++) {
            lines = tbodies[i].childNodes;
            calDate = dateEx.AddMonths(this.cfgPageDate,i); // i = cal_position
            startMonthDate = dateEx.findMonthStart(calDate);
            endMonthDate = dateEx.findMonthEnd(calDate);

            // startMonthDayNumber : offset for the first date of the month (how many cells before cell of first date of the month)
            startMonthDayNumber = startMonthDate.getDay();
            if (startMonthDayNumber === 0) {startMonthDayNumber = 7;} // Sunday should return 7 instead of 0

            // startCalDate : date of the first cell of the body (not necessarily first date of month).
            startCalDate = dateEx.AddDays(startMonthDate,1-startMonthDayNumber);
        
            for (j=0; j<this.cfgCalNbrLines; j++) {
               tr = lines[j];
               cells = tr.childNodes;
               for (k=0; k<7; k++) {
                  td = cells[k];
                  cellDate = dateEx.AddDays(startCalDate,j*7+k);
                  selectedDate = this.lastSelection.date;
              
                  if (cellDate.getDate() === selectedDate.getDate() && cellDate.getMonth() === selectedDate.getMonth() && cellDate.getYear() === selectedDate.getYear()) {
                     // mark if cell of last selection (matching cellId)
                     if (td.id === this.lastSelection.cellId) {
                        Dom.addClass(td,'selected');
                        // or mark if no cellId in lastSelection but date of lastSelection is matching and cell not disabled for selection
                     } else if (!this.lastSelection.cellId && !Dom.hasClass(td,'oom')) {
                        Dom.addClass(td,'selected');
                     } else {
                        Dom.removeClass(td,'selected');
                     }
                  } else {
                     Dom.removeClass(td,'selected');
                  }
               }
            }
         }
      }
   },


   /**
    * Update last selection : store last selected date and cellId
    * @param selectedCellId Id of selected cell
    */
   updateLastSelection : function(selectedCellId) {
      // Position Format : ['calcell', cal_position, line (start at 0), column (start at 0)]
      var cellPosition = selectedCellId.split('_'); 
      var calPosition = parseInt(cellPosition[1],10);
      var cellLine = parseInt(cellPosition[2],10);
      var cellColumn = parseInt(cellPosition[3],10);
   
      // Hack when we are on 31 of august for instance : findMonthStart executed before adding month 
      var calDate = dateEx.AddMonths(this.cfgPageDate,calPosition);
      var startMonthDate = dateEx.findMonthStart(calDate,calDate);
   
      // startMonthDayNumber : offset for the first date of the month (how many cells before cell of first date of the month)
      var startMonthDayNumber = startMonthDate.getDay();
      if (startMonthDayNumber === 0) {startMonthDayNumber = 7;} // Sunday should return 7 instead of 0
   
      // startCalDate : date of the first cell of the body (not necessarily first date of month).
      var startCalDate = dateEx.AddDays(startMonthDate,1-startMonthDayNumber);
   
      var cellDate = new Date((dateEx.AddDays(startCalDate,cellLine*7+cellColumn)).getTime());
   
      this.lastSelection.date = cellDate;
      this.lastSelection.cellId = selectedCellId;
   },

   /**
    * Update all calendars' cells to display new selection
    */
   updateSelectedDates : function() {
      // if no selection available, return.
      if (!this.lastSelection.date) {return;}
   
      // Collect new selected dates
      var newSelectedDates = [];
      var counter = 0;
      var currentDate = this.lastSelection.date;
      var currentDay;
   
      while (counter<this.cfgNumberOfDatesToSelect) {
         currentDay = currentDate.getDay();
         if (currentDay === 0) {currentDay = 7;}
         counter++;
         newSelectedDates.push(currentDate);
         currentDate = dateEx.AddDays(currentDate,1);
      }
   
      // Set new selected dates and publish them
      this.cfgSelectedDates = newSelectedDates;
      this.publishSelectedDates();
   },

   /**
    * Fires an event ('changeSelectedDates') with array of selected dates as param.
    */
   publishSelectedDates : function() {
      this.changeSelectedDatesEvent.fire(this.cfgSelectedDates);
   },

   /**
    * Switch reference pageDate of 'count' months in the future. Fires 'changePage' event.
    * @param {Number} count Number of months to add to current pageDate
    */
   addMonths : function(count) {
      this.cfgPageDate = dateEx.AddMonths(this.cfgPageDate,count);
   },

   /**
    * Switch reference pageDate of 'count' months in the past. Fires 'changePage' event.
    * @param {Number} count Number of months to subtract to current pageDate
    */
   subtractMonths : function(count) {
      this.cfgPageDate = dateEx.AddMonths(this.cfgPageDate ,-count);
   },

   /**
    * Go to next page (go to the future).
    * @param {Event} e The intercepted event.
    */
   nextPage : function(e) {
      this.addMonths(this.cfgCalNumber);
      this.changePageEvent.fire();
   },

   /**
    * Go to previous page (go to the past).
    * @param {Event} e The intercepted event.
    */
   previousPage : function(e) {
      this.subtractMonths(this.cfgCalNumber);
      this.changePageEvent.fire();
   },


   /**
    * Go to next dates (go to the future), with same configuration as previous selection (same disabled weekDays and dates number)
    * @param {Number} offset (optional)  How many dates to skip including today (1 => go to tomorrow, 7 => go to next week, etc...)
    */
   nextDates : function(offset) {
      var dayOffset;
      if (!!offset && (typeof offset === "number")) {
         dayOffset = offset;
      } else if (this.cfgNavigationType === 'sameAsNODTS') {
         dayOffset = this.cfgNumberOfDatesToSelect;
      } else { // this.cfgNavigationType === '1by1, or else...
         dayOffset = 1;
      }
   
      // Loop over 1 to 7*dayOffset days to find first selectable date (if not found in 7*dayOffset days, no days selectable !)
      var currentDate = dateEx.AddDays(this.lastSelection.date, 1);
      var currentDay;
      var counter = 0;
      var counterOffset = dayOffset;

      while (counter<7*dayOffset) {
         currentDay = currentDate.getDay();
         if (currentDay === 0) {currentDay = 7;}
         if (counterOffset===1) {
            this.lastSelection.date = currentDate;
            this.lastSelection.cellId = null;

            var lastCalDate = dateEx.AddMonths(this.cfgPageDate,this.cfgCalNumber-1);
            var endMonthDate = dateEx.findMonthEnd(lastCalDate, lastCalDate);

            this.updateSelectedDates();

            var ms = endMonthDate.getTime();
            if (this.lastSelection.date.getTime() > ms) {
               this.nextPage();
            } else {
               this.markSelectedCell();
            }

            break;
         } else {
            counterOffset -= 1;
            counter++;
            currentDate =dateEx.AddDays(currentDate, 1);
         }
      }      
   },

   /**
    * Go to previous dates (go to the past), with same configuration as previous selection(same disabled weekDays and dates number)
    * @param {Number} offset (optional)  How many dates to skip including today (1 => go to yesterday, 7 => go to last week, etc...)
    */
   previousDates : function(offset) {
      var dayOffset;
      if (!!offset && (typeof offset === "number")) {
         dayOffset = offset;
      } else if (this.cfgNavigationType === 'sameAsNODTS') {
         dayOffset = this.cfgNumberOfDatesToSelect;
      } else { // this.cfgNavigationType === '1by1, or else...
         dayOffset = 1;
      }
   
      // Loop over 1 to 7*dayOffset days to find first selectable date 
      var currentDate = dateEx.AddDays(this.lastSelection.date, -1);
      var currentDay;
      var counter = 0;
      var counterOffset = dayOffset;

      while (counter<7*dayOffset) {
         currentDay = currentDate.getDay();
         if (currentDay === 0) {currentDay = 7;}
      
         if (counterOffset===1) {
            this.lastSelection.date = currentDate;
            this.lastSelection.cellId = null;

            this.updateSelectedDates();
            
            // first month start
            var ms = this.cfgPageDate.getTime();
            if (this.lastSelection.date.getTime() < ms) {
               this.previousPage();
            } else {
               this.markSelectedCell();
            }

            break;
         } else {
            counterOffset -= 1;
            counter++;
            currentDate = dateEx.AddDays(currentDate,-1);
         }
      }
   },

   /**
    * Go to today
    */
   gotoToday : function() {
      this.gotoDate(dateEx.getToday());
   },

   /**
    * Go to date
    * @param {date} e The intercepted event.
    */
   gotoDate : function(date) {
      this.cfgPageDate = dateEx.findMonthStart(date);
      this.lastSelection.date = date;
      this.lastSelection.cellId = null;
      this.updateSelectedDates();
      this.update();
   },

   /**
    * Hide calendar
    */
   hide : function() {
      this.visible = false;
      this.shadow_container.style.display = 'none';
   },

   /**
    * Show calendar
    */
   show : function() {
      this.visible = true;
      this.resetTimer(3000);
      this.shadow_container.style.display = '';
   },

   /**
    * Toggle calendar
    */
   toggle : function() {
      (this.visible) ? this.hide() : this.show();
   },
 
   /**
    * Listen if mouse out of the minical. If so, starts (or reset) a timer for auto-close.
    */
   onMinicalMouseOut : function() {
      this.resetTimer();
   },

   /**
    * Listen if mouse over of the minical. If so, disable any timer for auto-close.
    */
   onMinicalMouseOver : function() {
      if (this.timer) {
         clearTimeout(this.timer);
      }
   },

   /**
    * The timer is used to wait a little before hiding minical when mouse outside it
    * @param {Number} delay (optional) Delay in ms to set to the timer
    */
   resetTimer : function(delay) {
      if (this.timer) {
         clearTimeout(this.timer);
      }
      delay = delay || this.cfgAutoCloseDelay;
      var that = this; // Hack to avoid scope problems with setTimeout
      this.timer = setTimeout(function() {that.timerEnd();}, delay);
   },

   /**
    * Hide minical when autoCloseDelay reached
    */
   timerEnd : function() {
      this.hide();
   }

};


/**
 * date strings
 */
inputEx.messages.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Decembre"];
inputEx.messages.dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];

inputEx.messages.calendarNavLeft = "Previous month";
inputEx.messages.calendarNavRight = "Next month";

})();