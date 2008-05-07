
inputEx.dbAdmin = {
   
   queryDbFields: function(tableName) {
      YAHOO.util.Connect.asyncRequest('POST', 'getStruct.php', { success: this.queryDbFieldsCallback, scope: this}, "table="+tableName);
   },
   
   queryDbFieldsCallback: function(o) {
      var fields = YAHOO.lang.JSON.parse(o.responseText);
      var config = this.getFormConfig(fields);
      
      this.generateForm(config);
   },
  
  getFormConfig: function(dbFields) {
     var config = [];
     for(var i = 0 ; i < dbFields.length ; i++) {
        config.push(this.getFieldConfig(dbFields[i]));
     }
     return {fields: config};
  },
  
  getFieldConfig: function(dbField) {
     var field = { inputParams: {} };
     
     field.label = dbField["Field"];
     field.inputParams.name = dbField["Field"];
    
     field.type = this.getType(dbField["Type"]);
     field.inputParams.value = dbField["Default"];
     
     return field;
  },
  
  getType: function(dbType) {
     if(dbType == "varchar(255)") {
        return "string";
     }
     
     return "string";
  },
  
  generateForm: function(config) {
     
     var form = new inputEx.Group(config);
     document.getElementById('container').appendChild(form.getEl());
  }
   
};


YAHOO.util.Event.addListener(window, 'load', function() {
   inputEx.dbAdmin.queryDbFields("interventions");
});

