
/**
 *  YAHOO.inputEx.builder.ButtonsTable
 */
YAHOO.inputEx.builder.ButtonsTable = function() {
   YAHOO.inputEx.builder.ButtonsTable.superclass.constructor.call(this, "Buttons", ['Text', 'Type'] );
};

YAHOO.extend(YAHOO.inputEx.builder.ButtonsTable,YAHOO.inputEx.builder.Table);


YAHOO.inputEx.builder.ButtonsTable.prototype.getRowElements = function(button) {
   
   // Le nom du champ
   var fieldNameField = cn('input', {type: 'text', value: button.value || ""});
   
   // Le type du champ
   var select = cn('select');
   cn('option', null, null, 'submit').appendTo(select);
  
   return [fieldNameField, select];
};


YAHOO.inputEx.builder.ButtonsTable.prototype.getValue = function() {
  
  var buttons = [];
  
  for(var i = 0 ; i < this.tbody.rows.length ; i++) {
     var row = this.tbody.rows[i];
     
     var text = row.cells[0].childNodes[0].value;
     var type = row.cells[1].childNodes[0].value;
     
     buttons.push({value: text, type: type});
  } 
   
  return buttons; 
};
   
