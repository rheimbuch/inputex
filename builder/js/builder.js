
/**
 * inputEx.builder
 * @constructor
 * @params  {DOMel}  parentEl
 * @params  {inputExFormStruct}  inputExFormStruct
 */
inputEx.builder = function(parentEl, inputExFormStruct) {

   // Save parameters locally
   this.parentEl = parentEl;
   this.inputExFormStruct = inputExFormStruct || inputEx.builder.defaultStruct;

   // Render the dom of the builder
   this.render();
   
   // Set the value of the editor with the passed structure
   this.setValue();
};

/**
 * Default structure
 */
inputEx.builder.defaultStruct = {
	inputs: [ 
		{label: "", type: inputEx.HiddenField, inputParams: {name: "id"} },
		{label: "Name", type: inputEx.Field, inputParams: {name: "name" } }
	],
	buttons: [
		{value: "Valider", type: "submit"}
	],
	label: "Default Label"
};

/**
 * @method render
 *
 * Create the dom of the builder.
 */
inputEx.builder.prototype.render = function() {
   
   // Crée la table de 3 cellules
   var table = cn('table', {className: 'inputEx-builder-table'});
   var tbody = cn('tbody').appendTo(table);
   var tr = cn('tr').appendTo(tbody);
   
   // Editor
   var td1 = cn('td', {className: 'inputEx-builder-cell'}).appendTo(tr);
   this.editorContainer = cn('div').appendTo(td1);
   
   // Previewer
   var td2 = cn('td', {className: 'inputEx-builder-cell'}).appendTo(tr);
   cn('h2', {className: 'inputEx-builder-cellTitle'}, null, 'Preview').appendTo(td2);
   
   var refreshButton = cn('button', null, {margin: '10px;'}, "Refresh").appendTo(td2);
   YAHOO.util.Event.addListener(refreshButton, 'click', this.updateForm, this, true);
   
   this.formContainer = cn('div').appendTo(td2);
   
   // Render l'editor de gauche
   this.renderEditor();
   
   // Ajoute le tout au dom
   this.parentEl.appendChild(table);
   
};

/**
 * @method renderEditor
 *
 * Create the dom of the editor cell
 */
inputEx.builder.prototype.renderEditor = function() {
   
   // Titre
   cn('h2', {className: 'inputEx-builder-cellTitle'}, null, 'Editor').appendTo(this.editorContainer);
   
   // Le label du formulaire
   this.formLabelField = cn('input', {type: 'text'});
   this.editorContainer.innerHTML += "Form label : ";
   this.editorContainer.appendChild(this.formLabelField);
   YAHOO.util.Event.addListener(this.formLabelField, 'change', this.updateForm, this, true);
   
   // Tableau contenant la liste des champs
   this.fieldsTable = new inputEx.builder.FieldsTable();
   //this.fieldsTable.updateEvt.subscribe(this.updateForm, this, true);
   this.fieldsTable.getEl().appendTo(this.editorContainer);
   
   // Tableau contenant la liste des boutons
   this.buttonsTable = new inputEx.builder.ButtonsTable();
   //this.buttonsTable.updateEvt.subscribe(this.updateForm, this, true);
   this.buttonsTable.getEl().appendTo( this.editorContainer );
};


/**
 * @method setValue
 *
 * Set the value of the editor
 */
inputEx.builder.prototype.setValue = function() {
   
   // Various parameters of the field
   this.formLabelField.value = this.inputExFormStruct.label;
   
   // Les champs :
   this.fieldsTable.setValues(this.inputExFormStruct.inputs);
   
   // Les boutons:
   this.buttonsTable.setValues(this.inputExFormStruct.buttons);
   
   // Regénère le formulaire
   this.updateForm();
};

/**
 * @method getValue
 *
 * Get the value of the editor
 */
inputEx.builder.prototype.getValue = function() {
   
   this.inputExFormStruct = {
      inputs: this.fieldsTable.getValue(),
      buttons: this.buttonsTable.getValue(),
      label: this.formLabelField.value
   };
   
   return this.inputExFormStruct;
};

/**
 * @method updateForm
 *
 * update the demo form
 */
inputEx.builder.prototype.updateForm = function() {
   
   var struct = this.getValue();
   
   // Form preview
   this.formContainer.innerHTML = "";
   this.form = new inputEx.Form( struct );
   this.formContainer.appendChild( this.form.getEl() );
   
};
