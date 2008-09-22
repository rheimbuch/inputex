(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;

/**
 * @class inputEx.BirthdateField
 * @extends inputEx.CombineField
 */
inputEx.BirthdateField = function(options) {
   	
   if(!options.dateFormat) {options.dateFormat = inputEx.messages.defaultDateFormat; }
   
   var formatSplit = options.dateFormat.split("/");
   this.yearIndex = inputEx.indexOf('Y',formatSplit);
   this.monthIndex = inputEx.indexOf('m',formatSplit);
   this.dayIndex = inputEx.indexOf('d',formatSplit);
   
   options.fields = [];
   for(var i = 0 ; i < 3 ; i++) {
      if(i == this.dayIndex) {
         options.fields.push({type: 'string', inputParams: { typeInvite: inputEx.messages.dayTypeInvite, size: 2} });
      }
      else if(i == this.yearIndex) {
         options.fields.push({type: 'string', inputParams: { typeInvite: inputEx.messages.yearTypeInvite, size: 4} });
      }
      else {
         options.fields.push({type: 'select', inputParams: {selectOptions: ([inputEx.messages.selectMonth]).concat(inputEx.messages.months), selectValues: [-1,0,1,2,3,4,5,6,7,8,9,10,11], value: -1} });
      }
   }

   options.separators = options.separators || [false,"&nbsp;","&nbsp;",false];
   
	inputEx.BirthdateField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.BirthdateField, inputEx.CombineField, {
   
   setValue: function(value) {
      if( !lang.isFunction(value.getTime) || !lang.isNumber(value.getTime()) ) { return; }
      var values = [];
      for(var i = 0 ; i < 3 ; i++) {
         values.push( i == this.dayIndex ? value.getDate() : (i==this.yearIndex ? value.getFullYear() : value.getMonth() ) );
      }
      inputEx.BirthdateField.superclass.setValue.call(this, values);
   },
   
   getValue: function() {
      var values = inputEx.BirthdateField.superclass.getValue.call(this);
      return new Date(parseInt(values[this.yearIndex]), values[this.monthIndex], parseInt(values[this.dayIndex]) );
   },
   
   validate: function() {
      var values = inputEx.BirthdateField.superclass.getValue.call(this);
      var val = this.getValue();
      var ret = (values[this.monthIndex] != -1 && lang.isFunction(val.getTime) && lang.isNumber(val.getTime()) );
      return ret;
   }
   
});

inputEx.messages.selectMonth = "- Select Month -";
inputEx.messages.dayTypeInvite = "Day";
inputEx.messages.yearTypeInvite = "Year";

/**
* Register this class as "birthdate" type
*/
inputEx.registerType("birthdate", inputEx.BirthdateField);

})();