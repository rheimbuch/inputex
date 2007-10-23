/**
 * Quelques champs étendus inputEx
 * en francais !
 */

// Definition des messages en francais
YAHOO.inputEx.messages = {
	required: "Ce champ est obligatoire",
	invalid: "Ce champ n'est pas valide",
	invalidEmail: "Email non valide, ex: michel.dupont@fai.fr",
	selectColor: "S&eacute;lectionnez une couleur :"
};

/**
 * @class YAHOO.inputEx.FrenchPhone
 */
YAHOO.inputEx.FrenchPhone = function(options) {
	options.format = '## ## ## ## ##';
	options.messages = {invalid: "Numéro non valide."};
	YAHOO.inputEx.FrenchPhone.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.FrenchPhone, YAHOO.inputEx.FormattedField);

YAHOO.inputEx.FrenchPhone.prototype.validate = function () {
	var value = this.getValue();
	if( value.match('_') ) { return false; }
	if( value.substr(0,1) != '0' ) { return false; }
	return true;
};

/**
 * @class YAHOO.inputEx.FrenchDate
 */
YAHOO.inputEx.FrenchDate = function(options) {
	options.dateFormat = 'd/m/Y';
	options.messages = {invalid: "Date non valide, ex: 25/01/2007"};
	YAHOO.inputEx.FrenchDate.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.FrenchDate, YAHOO.inputEx.DateField);
