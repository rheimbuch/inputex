

/**
 * YAHOO.inputEx.builder.Table
 *
 * 
 */
YAHOO.inputEx.builder.Table = function(tableName, fieldsName) {
   
   this.render(tableName, fieldsName);
   
};

YAHOO.inputEx.builder.Table.prototype.render = function(tableName, fieldsName) {
   
   this.el = cn('div');
   
   // Create the table
   this.table = cn('table', {className: 'inputEx-builder-fieldsTable'}).appendTo(this.el);

   // HEAD
   var thead = cn('thead').appendTo(this.table);
   tr = cn('tr').appendTo(thead);
   cn('th',{colspan: fieldsName.length+1}, null, tableName).appendTo(tr);
   tr = cn('tr').appendTo(thead);
   for( var i = 0 ; i < fieldsName.length ; i++) {
      cn('th',null, null, fieldsName[i]).appendTo(tr);
   }
   cn('th',null, null, "Actions").appendTo(tr);

   // BODY
   this.tbody = cn('tbody').appendTo(this.table);
   
   // Add Row link
   var a = cn('a', null, null, 'Add a row').appendTo(this.el);
   YAHOO.util.Event.addListener(a, 'click', this.addNewRow, this, true);
};

YAHOO.inputEx.builder.Table.prototype.getEl = function() {
   return this.el;
};


YAHOO.inputEx.builder.Table.prototype.addNewRow = function(e, elmt) {
   
   var tr = cn('tr');
   
   var elements = this.getRowElements(elmt);
   
   for( var i = 0 ; i < elements.length ; i++) {
      var td = cn('td');
      td.appendChild(elements[i]);
      tr.appendChild(td);
   }
   
   // Actions :
   var actionsTd = cn('td').appendTo(tr);
   
   var that = this;
   var removeLink = cn('a', null, null, "Remove").appendTo(actionsTd);
   YAHOO.util.Event.addListener(removeLink, 'click', function() { 
      var td = this.parentNode;
      var tr = td.parentNode;
      var tbody = tr.parentNode;
      tbody.removeChild(tr);
      that.updateEvt.fire();
   });
   
   tr.appendTo(this.tbody);
};


YAHOO.inputEx.builder.Table.prototype.setValues = function(values) {
   this.tbody.innerHTML = "";
   for(var i = 0 ; i < values.length ; i++) {
      this.addNewRow(null, values[i]);
   }
};