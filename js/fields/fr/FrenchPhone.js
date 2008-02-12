
/**
 * @class inputEx.FrenchPhone
 */
inputEx.FrenchPhone = function(options) {
	options.format = '## ## ## ## ##';
	options.messages = {invalid: "Numéro non valide."};
	inputEx.FrenchPhone.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FrenchPhone, inputEx.FormattedField);

inputEx.FrenchPhone.prototype.validate = function () {
	var value = this.getValue();
	if( value.match('_') ) { return false; }
	if( value.substr(0,1) != '0' ) { return false; }
	return true;
};