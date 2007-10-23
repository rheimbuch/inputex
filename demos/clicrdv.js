
/**
 * @class YAHOO.inputEx.UserForm
 * This is a clicrdv form
 */
YAHOO.inputEx.UserForm = function() {
	
	var formOptions = {
			inputs: [ 
				{label: "Nom", inputParams: {name: "lastname", required: true} },
				{label: "Prénom", inputParams: {name: "firstname", required: true } },
				{label: "Date de naissance",  type: YAHOO.inputEx.FrenchDate, inputParams: {name: "birthdate", required: true } },
				{label: "Email", type: YAHOO.inputEx.EmailField, inputParams: { name: "email",  required: true } },
				{label: "Téléphone principal",type: YAHOO.inputEx.FrenchPhone, inputParams: { name: "firstphone" }},
				{label: "Téléphone secondaire",type: YAHOO.inputEx.FrenchPhone, inputParams: { name: "secondphone"}},
				{label: "Commentaires",type: YAHOO.inputEx.Textarea, inputParams: { name: "comments"}},
				{label: "Couleur",type: YAHOO.inputEx.ColorField, inputParams: { name: "color", auto:3, ratio:[4,3]}}// colors:["FF0055","000000","880013","FF33FF","EE1363","B47A6F","FF0055","000000","884411","FF0055","880013","FF33FF","EE1363","000000","884411","FF0055","000000","884411"]}}
			],
			buttons: [
				{value: "Valider", type: "submit"},
				{value: "Fermer", type: "button", onClick: function() { alert("fermer la fenetre ici ?"); } }
			],
			label: "User informations",
			method: 'POST',
			action: '/assistant/get'
		};
	
	YAHOO.inputEx.UserForm.superclass.constructor.call(this,formOptions);
};
YAHOO.lang.extend(YAHOO.inputEx.UserForm, YAHOO.inputEx.Form);

YAHOO.inputEx.UserForm.prototype.onSubmit = function(e) {
	YAHOO.util.Event.stopEvent(e);
	if ( !this.validate() ) {
		return ;
	} 
	console.log(this.getValue());
	
};
	
	
YAHOO.util.Event.onAvailable('container', function() {
		
		// Create the form
		var form = new YAHOO.inputEx.UserForm();
		
		// Append it to the 'container' div
		YAHOO.util.Dom.get('container').appendChild( form.getEl() );
});