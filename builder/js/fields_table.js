
/**
 *  YAHOO.inputEx.builder.FieldsTable
 */
YAHOO.inputEx.builder.FieldsTable = function() {
   this.propertiesForms = {};
   YAHOO.inputEx.builder.FieldsTable.superclass.constructor.call(this, "Fields", ['Fieldname', 'Editor', 'Properties'] );
};

YAHOO.extend(YAHOO.inputEx.builder.FieldsTable,YAHOO.inputEx.builder.Table);


YAHOO.inputEx.builder.FieldsTable.typeLabels = [ "text", "color", "date", "email", "hidden", "IP", "Password", "selector", "text area", "checkbox"];
YAHOO.inputEx.builder.FieldsTable.typeClasses = [YAHOO.inputEx.Field, 
                                                 YAHOO.inputEx.ColorField, 
                                                 YAHOO.inputEx.DateField, 
                                                 YAHOO.inputEx.EmailField, 
                                                 YAHOO.inputEx.HiddenField,
                                                 YAHOO.inputEx.IpadressField,
                                                 YAHOO.inputEx.PasswordField,
                                                 YAHOO.inputEx.SelectField,
                                                 YAHOO.inputEx.Textarea, 
                                                 YAHOO.inputEx.checkBox];


YAHOO.inputEx.builder.FieldsTable.prototype.getRowElements = function(field) {
   
   var value = "";
   if( field && field.inputParams && field.inputParams.name) {
      value = field.inputParams.name;  
   }
   
   // Le nom du champ
   var fieldNameField = cn('input', {type: "text", value: value});
   
   // Le type du champ
   var select = this.generateTypeSelector();
   var index = YAHOO.inputEx.builder.FieldsTable.typeClasses.indexOf(field.type);
   if( index != -1 ) {
      select.selectedIndex = index;
   }
   
   // Properties:
   var propertiesEl=null;
   var type = field.type
   if( !YAHOO.inputEx.builder.propertiesForms[type] ) {
      type = YAHOO.inputEx.builder.DefaultForm;
   }
      
   var f = new YAHOO.inputEx.builder.propertiesForms[type](field);
   this.propertiesForms[select.id] = f;
   propertiesEl = f.getEl();
   
   return [fieldNameField, select, propertiesEl];
};



/**
 * @method generateTypeSelector
 *
 * Generate a select tag containing the various options type
 */
YAHOO.inputEx.builder.FieldsTable.prototype.generateTypeSelector = function() {
   
   if(!this.nextSelectId) this.nextSelectId = 0;
   
   var select = cn('select', {id: 'inputEx-builder-typeSelector'+this.nextSelectId});
   this.nextSelectId += 1;
   
   var options = YAHOO.inputEx.builder.FieldsTable.typeLabels;
   for(var i = 0 ; i < options.length ; i++) {
      cn('option', {value: options[i]}, null, options[i]).appendTo(select);
   }
   YAHOO.util.Event.addListener(select, 'change', function(e) { 
      
      // Update the property form !
      var select = e.target;
      var newType = YAHOO.inputEx.builder.FieldsTable.typeClasses[select.selectedIndex];
      
      var tdProperties = select.parentNode.nextSibling;
      tdProperties.innerHTML = "";
      
      // Create the form
      if(!YAHOO.inputEx.builder.propertiesForms[newType]) {
         newType = YAHOO.inputEx.builder.DefaultForm;
      }
      
      var f = new YAHOO.inputEx.builder.propertiesForms[newType]();
      this.propertiesForms[select.id] = f;
      tdProperties.appendChild(f.getEl());
   
   }, this, true);
   return select;
};

YAHOO.inputEx.builder.FieldsTable.prototype.getValue = function() {
   var inputs = [];
   
   for(var i = 0 ; i < this.tbody.rows.length ; i++) {
      var row = this.tbody.rows[i];
      
      var select = row.cells[1].childNodes[0];

      // Let's get the properties parameters :
      var form = this.propertiesForms[select.id];
      
      var input = form.getInputField();
      
      if( !input.inputParams ) input.inputParams = {};
      input.inputParams.name = row.cells[0].childNodes[0].value;
      
      input.type = YAHOO.inputEx.builder.FieldsTable.typeClasses[select.selectedIndex];

      inputs.push(input);
   }
   
   return inputs; 
};

