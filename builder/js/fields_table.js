
/**
 *  inputEx.builder.FieldsTable
 */
inputEx.builder.FieldsTable = function() {
   this.propertiesForms = {};
   inputEx.builder.FieldsTable.superclass.constructor.call(this, "Fields", ['Fieldname', 'Editor', 'Properties'] );
};

YAHOO.extend(inputEx.builder.FieldsTable,inputEx.builder.Table);


inputEx.builder.FieldsTable.typeLabels = [ "text", "color", "date", "email", "hidden", "IP", "Password", "selector", "text area", "checkbox"];
inputEx.builder.FieldsTable.typeClasses = [inputEx.Field, 
                                                 inputEx.ColorField, 
                                                 inputEx.DateField, 
                                                 inputEx.EmailField, 
                                                 inputEx.HiddenField,
                                                 inputEx.IpadressField,
                                                 inputEx.PasswordField,
                                                 inputEx.SelectField,
                                                 inputEx.Textarea, 
                                                 inputEx.checkBox];


inputEx.builder.FieldsTable.prototype.getRowElements = function(field) {
   
   var value = "";
   if( field && field.inputParams && field.inputParams.name) {
      value = field.inputParams.name;  
   }
   
   // Le nom du champ
   var fieldNameField = cn('input', {type: "text", value: value});
   
   // Le type du champ
   var select = this.generateTypeSelector();
   var index = inputEx.builder.FieldsTable.typeClasses.indexOf(field.type);
   if( index != -1 ) {
      select.selectedIndex = index;
   }
   
   // Properties:
   var propertiesEl=null;
   var type = field.type
   if( !inputEx.builder.propertiesForms[type] ) {
      type = inputEx.builder.DefaultForm;
   }
      
   var f = new inputEx.builder.propertiesForms[type](field);
   this.propertiesForms[select.id] = f;
   propertiesEl = f.getEl();
   
   return [fieldNameField, select, propertiesEl];
};



/**
 * @method generateTypeSelector
 *
 * Generate a select tag containing the various options type
 */
inputEx.builder.FieldsTable.prototype.generateTypeSelector = function() {
   
   if(!this.nextSelectId) this.nextSelectId = 0;
   
   var select = cn('select', {id: 'inputEx-builder-typeSelector'+this.nextSelectId});
   this.nextSelectId += 1;
   
   var options = inputEx.builder.FieldsTable.typeLabels;
   for(var i = 0 ; i < options.length ; i++) {
      cn('option', {value: options[i]}, null, options[i]).appendTo(select);
   }
   YAHOO.util.Event.addListener(select, 'change', function(e) { 
      
      // Update the property form !
      var select = e.target;
      var newType = inputEx.builder.FieldsTable.typeClasses[select.selectedIndex];
      
      var tdProperties = select.parentNode.nextSibling;
      tdProperties.innerHTML = "";
      
      // Create the form
      if(!inputEx.builder.propertiesForms[newType]) {
         newType = inputEx.builder.DefaultForm;
      }
      
      var f = new inputEx.builder.propertiesForms[newType]();
      this.propertiesForms[select.id] = f;
      tdProperties.appendChild(f.getEl());
   
   }, this, true);
   return select;
};

inputEx.builder.FieldsTable.prototype.getValue = function() {
   var inputs = [];
   
   for(var i = 0 ; i < this.tbody.rows.length ; i++) {
      var row = this.tbody.rows[i];
      
      var select = row.cells[1].childNodes[0];

      // Let's get the properties parameters :
      var form = this.propertiesForms[select.id];
      
      var input = form.getInputField();
      
      if( !input.inputParams ) input.inputParams = {};
      input.inputParams.name = row.cells[0].childNodes[0].value;
      
      input.type = inputEx.builder.FieldsTable.typeClasses[select.selectedIndex];

      inputs.push(input);
   }
   
   return inputs; 
};

