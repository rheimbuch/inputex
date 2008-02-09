/**
 * @class inputEx.FrenchDate
 */
inputEx.FrenchDate = function(options) {
	options.dateFormat = 'd/m/Y';
	options.messages = {invalid: "Date non valide, ex: 25/01/2007"};
	inputEx.FrenchDate.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FrenchDate, inputEx.DateField);
