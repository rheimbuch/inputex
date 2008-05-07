/**
 * @class inputEx.FrenchPhone
 * @extends inputEx.Field
 */
inputEx.FrenchPhone = function(options) {
	inputEx.FrenchPhone.superclass.constructor.call(this,options);
	this.options.regexp = /^( *[0-9] *){10}$/;
	this.options.messages.invalid = "Numéro de téléphone non valide, ex: 06 12 34 56 78";
};
YAHOO.lang.extend(inputEx.FrenchPhone, inputEx.Field);