/**
 * @class inputEx.DateField
 *
 * options: 
 *		- dateFormat: default to 'm/d/Y'
 */
inputEx.DateField = function(options) {
	options.format = '##/##/####';
	options.dateFormat = options.dateFormat || 'm/d/Y';
	inputEx.DateField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.DateField, inputEx.FormattedField);

inputEx.DateField.prototype.validate = function () {
	
	var value = this.el.value;
	if( value.match('_') ) { return false; }
   if (value === "") { return false; }
   var ladate = value.split("/");
   if ((ladate.length != 3) || isNaN(parseInt(ladate[0])) || isNaN(parseInt(ladate[1])) || isNaN(parseInt(ladate[2]))) { return false; }
	 var formatSplit = this.options.dateFormat.split('/');
	 var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
	 var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
	 var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   var unedate = new Date(Y,m,d);
   var annee = unedate.getFullYear();
   return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
};

inputEx.DateField.prototype.render = function() {
	inputEx.DateField.superclass.render.call(this);
	this.el.size = 10;
};

// Return value in DATETIME format (use getFormattedValue() to have 04/10/2002-like format)
inputEx.DateField.prototype.getValue = function() {
   // Hack to validate if field not required and empty
   if (this.el.value === '') { return '';}
   var ladate = this.getFormattedValue().split("/");
   var formatSplit = this.options.dateFormat.split('/');
   var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
   var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
   var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   return (new Date(Y,m,d));
};

inputEx.DateField.prototype.setValue = function(val) {
   
   // Don't try to parse a date if there is no date
   if( val === '' ) {
      this.el.value = '';
      return;
   }
   
  // DATETIME
	if (val instanceof Date) {
     str = this.options.dateFormat.replace('Y',val.getFullYear());
     str = str.replace('m',val.GetMonthNumberString());
     str = str.replace('d',val.GetDateString());
  } 
  // else date must match this.options.dateFormat
  else {
     str = val;
  }
		
	this.el.value = str;
};