/**
 * @class inputEx.FrenchDate
 */
inputEx.FrenchDate = function(options) {
	if(!options.dateFormat) {options.dateFormat = 'd/m/Y'; }
	inputEx.FrenchDate.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FrenchDate, inputEx.DateField);

/**
 * Register this class as "date" type
 */
inputEx.registerType("date_fr", inputEx.FrenchDate);