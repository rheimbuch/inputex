
YAHOO.inputEx.dbAdmin = {
   
   queryStructure: function() {
      YAHOO.util.Connect.asyncRequest('POST', 'getStruct.php', { success: this.queryStructureCallback, scope: this}, "db=neyricdotcom");
   },
   
   queryStructureCallback: function(o) {
      var resp = YAHOO.lang.JSON.parse(o.responseText);
      
      console.log(resp);
   },
   
   
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
     
     if(field.type=="boolean") {
        field.inputParams.sentValues = ["1","0"];
     }
     
     field.inputParams.value = dbField["Default"];
     
     return field;
  },
  
  getType: function(dbType) {
     if(dbType == "varchar(255)") {
        return "string";
     }
     
     if(dbType == "binary(1)") {
          return "boolean";
     }
     
     if(dbType == "longtext") {
        return "text";
     }
     
       if(dbType == "date") {
          return "date";
       }
     
     console.log(dbType);
     
     return "string";
  },
  
  generateForm: function(config) {
     
     var form = new YAHOO.inputEx.Group(config);
     document.getElementById('container').appendChild(form.getEl());
  }
   
};


YAHOO.util.Event.addListener(window, 'load', function() {
   YAHOO.inputEx.dbAdmin.queryStructure();
   //YAHOO.inputEx.dbAdmin.queryDbFields("contacts");
});

