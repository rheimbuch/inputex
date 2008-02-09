
/**
 *  inputEx.builder.ButtonsTable
 */
inputEx.builder.ButtonsTable = function() {
   inputEx.builder.ButtonsTable.superclass.constructor.call(this, "Buttons", ['Text', 'Type'] );
};

YAHOO.extend(inputEx.builder.ButtonsTable,inputEx.builder.Table);


inputEx.builder.ButtonsTable.prototype.getRowElements = function(button) {
   
   // Le nom du champ
   var fieldNameField = cn('input', {type: 'text', value: button.value || ""});
   
   // Le type du champ
   var select = cn('select');
   cn('option', null, null, 'submit').appendTo(select);
  
   return [fieldNameField, select];
};


inputEx.builder.ButtonsTable.prototype.getValue = function() {
  
  var buttons = [];
  
  for(var i = 0 ; i < this.tbody.rows.length ; i++) {
     var row = this.tbody.rows[i];
     
     var text = row.cells[0].childNodes[0].value;
     var type = row.cells[1].childNodes[0].value;
     
     buttons.push({value: text, type: type});
  } 
   
  return buttons; 
};
   
