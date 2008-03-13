/**
 * @class inputEx.DateField
 *
 * options: 
 *		- dateFormat: default to 'm/d/Y'
 */
inputEx.DateField = function(options) {
   if(!options) { var options = {}; }
	if(!options.dateFormat) {options.dateFormat = 'm/d/Y'; }
	inputEx.DateField.superclass.constructor.call(this,options);
	this.options.messages.invalidDate = inputEx.messages.invalidDate;
};
YAHOO.lang.extend(inputEx.DateField, inputEx.Field, {
   
   validate: function() {
      
      var value = this.el.value;
      var ladate = value.split("/");
      if( ladate.length != 3) { return false; }
      if ( isNaN(parseInt(ladate[0])) || isNaN(parseInt(ladate[1])) || isNaN(parseInt(ladate[2]))) { return false; }
   	var formatSplit = this.options.dateFormat.split("/");
   	var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
   	var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
   	var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
      var unedate = new Date(Y,m,d);
      var annee = unedate.getFullYear();
      return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
   },
   
   render: function() {
   	inputEx.DateField.superclass.render.call(this);
   	this.el.size = 10;
   },
   

   setValue: function(val) {

      // Don't try to parse a date if there is no date
      if( val === '' ) {
         this.el.value = '';
         return;
      }
      var str = "";
     // DATETIME
   	if (val instanceof Date) {
         str = this.options.dateFormat.replace('Y',val.getFullYear());
         var m = val.getMonth()+1;
         str = str.replace('m', ((m < 10)? '0':'')+m);
         var d = val.getDate();
         str = str.replace('d', ((d < 10)? '0':'')+d);
     } 
     // else date must match this.options.dateFormat
     else {
        str = val;
     }

   	this.el.value = str;
   },
   
   // Return value in DATETIME format (use getFormattedValue() to have 04/10/2002-like format)
   getValue: function() {
      // Hack to validate if field not required and empty
      if (this.el.value === '') { return '';}
      var ladate = this.el.value.split("/");
      var formatSplit = this.options.dateFormat.split('/');
      var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
      var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
      var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
      return (new Date(Y,m,d));
   }
   

});

// Specific message for the container
inputEx.messages.invalidDate = "Invalid date, ex: 03/27/2008";

/**
 * Register this class as "date" type
 */
inputEx.registerType("date", inputEx.DateField);
