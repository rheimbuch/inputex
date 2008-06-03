(function() {
/**
 * WARNING: the json-schema methods are experimental.
 *
 * Conversion between inputEx json format and JSON Schema
 * based on "Json Schema Proposal Second Draft" at
 * http://groups.google.com/group/json-schema/web/json-schema-proposal---second-draft
 *
 * The proposal is still under discussion and the implementation is very minimalist.
 *
 */
   var inputEx = YAHOO.inputEx;
   
   /**
    * Convert a json schema to a inputEx group object config
    * @param {Object} jsonSchema The evaled JSON schema
    * @param {String} groupName optional, used for the "object" json schema type
    */
   inputEx.importJsonSchema = function(jsonSchema, groupName) {
      var ret = { fields: [] };
      
      if(groupName) ret.name = groupName;
      
      for(var key in jsonSchema.properties) {
         if(jsonSchema.properties.hasOwnProperty(key)) {
            var p = jsonSchema.properties[key];
            var field = { label: key, inputParams: { name: key} };
            if(p.type) {
               field.type = p.type;
               
               if(p.type == "object") {
                  field.type = "group";
                  field.inputParams = inputEx.importJsonSchema(p, key);
               }
               else if(p.type == "string" && (!!p.options) ) {
                  field.type = "select";
                  field.inputParams.selectOptions = [];
                  field.inputParams.selectValues = [];
                  for(var i = 0 ; i < p.options.length ; i++) {
                     var o = p.options[i];
                     field.inputParams.selectOptions.push(o.label);
                     field.inputParams.selectValues.push(o.value);
                  }
               }
               else if(p.type == "string") {
                  if( p.format ) {
                     if(p.format == "html") {
                        field.type = "html";
                     }
                     else if(p.format == "date") {
                        field.type = "date";
                        field.inputParams.tooltipIcon = true;
                     }
                  }
               }
            }
            else if(p["$ref"]) {
               
            }
            ret.fields.push(field);
         }
      }
      
      return ret;
   };
   
})();