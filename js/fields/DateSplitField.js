(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;

/**
 * @class inputEx.DateSplitField
 * @extends inputEx.CombineField
 */
inputEx.DateSplitField = function(options) {
   	
   if(!options.dateFormat) {options.dateFormat = inputEx.messages.defaultDateFormat; }
   
   var formatSplit = options.dateFormat.split("/");
   this.yearIndex = inputEx.indexOf('Y',formatSplit);
   this.monthIndex = inputEx.indexOf('m',formatSplit);
   this.dayIndex = inputEx.indexOf('d',formatSplit);
   
   options.fields = [];
   for(var i = 0 ; i < 3 ; i++) {
      if(i == this.dayIndex) {
         options.fields.push({type: 'integer', inputParams: { typeInvite: inputEx.messages.dayTypeInvite, size: 2} });
      }
      else if(i == this.yearIndex) {
         options.fields.push({type: 'integer', inputParams: { typeInvite: inputEx.messages.yearTypeInvite, size: 4} });
      }
      else {
         options.fields.push({type: 'integer', inputParams: {typeInvite: inputEx.messages.monthTypeInvite, size: 2} });
      }
   }

   options.separators = options.separators || [false,"&nbsp;","&nbsp;",false];
   
	inputEx.DateSplitField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.DateSplitField, inputEx.CombineField, {
   
   setValue: function(value) {
      var values = [];
      
      // !value catches "" (empty field), and invalid dates
      if(!value || !lang.isFunction(value.getTime) || !lang.isNumber(value.getTime()) ) {
         values[this.monthIndex] = "";
         values[this.yearIndex] = "";
         values[this.dayIndex] = "";
      } else {
         for(var i = 0 ; i < 3 ; i++) {
            values.push( i == this.dayIndex ? value.getDate() : (i==this.yearIndex ? value.getFullYear() : value.getMonth()+1 ) );
         }
      }
      inputEx.DateSplitField.superclass.setValue.call(this, values);
   },
   
   getValue: function() {
      if (this.isEmpty()) return "";
      
      var values = inputEx.DateSplitField.superclass.getValue.call(this);
      
      return new Date(values[this.yearIndex], values[this.monthIndex]-1, values[this.dayIndex] );
   },
   
   validate: function() {
      var subFieldsValidation = inputEx.DateSplitField.superclass.validate.call(this);
      if (!subFieldsValidation) return false;
      
      var values = inputEx.DateSplitField.superclass.getValue.call(this);
      var day = values[this.dayIndex];
      var month = values[this.monthIndex];
      var year = values[this.yearIndex];
      
      var val = this.getValue();
      //console.log("datesplit value = ",val);
      
      // 3 empty fields
      if (val == "") return true;
      
      // if a field is empty, it will be set by default (day : 31, month:12, year: 1899/1900)
      //   -> val == "" MUST be checked first !
      if (day == "" || month == "" || year == "") return false;
      
      if (year < 0 || year > 9999 || day < 1 || day > 31 || month < 1 || month > 12) return false;
      
      // val == any date -> true
      // val == "Invalid Date" -> false
      return (val != "Invalid Date");
   },
   
	isEmpty: function() {
	   var values = inputEx.DateSplitField.superclass.getValue.call(this);
	   return (values[this.monthIndex] == "" && values[this.yearIndex] == "" &&  values[this.dayIndex] == "");
	}
   
});

inputEx.messages.monthTypeInvite = "Month";
inputEx.messages.dayTypeInvite = "Day";
inputEx.messages.yearTypeInvite = "Year";

/**
* Register this class as "birthdate" type
*/
inputEx.registerType("datesplit", inputEx.DateSplitField);

})();