/**
 * Build a form to run a service !
 * built for yui-rpc
 * @namespace inputEx
 * @method generateServiceForm
 * @param {function} method
 * @param {Object} formOpts
 */
inputEx.generateServiceForm = function(method, formOpts, callback) {
   
   // convert the method parameters into a json-schema :
   var schemaIdentifierMap = {};
   schemaIdentifierMap[method.name] = {
       id: method.name,
       type:'object',
       properties:{}
   };
   for(var i = 0 ; i < method._parameters.length ; i++) {
      var p = method._parameters[i];
      schemaIdentifierMap[method.name].properties[p.name] = p;
   }
   
   // Use the builder to build an inputEx form from the json-schema
   var builder = new YAHOO.inputEx.JsonSchema.Builder({
	  'schemaIdentifierMap': schemaIdentifierMap,
	  'defaultOptions':{
	     'showMsg':true
	  }
   });
	var options = builder.schemaToInputEx(schemaIdentifierMap[method.name]);
	
	
	// Add user options from formOpts
   YAHOO.lang.augmentObject(options.inputParams, formOpts, true);
   
   // Add buttons to launch the service
   options.type = "form";
   if(!options.inputParams.buttons) {
      options.inputParams.buttons = [
         {type: 'submit', value: method.name, onClick: function(e) {
            YAHOO.util.Event.stopEvent(e);
            method(form.getValue(), callback);
         }}
      ];
   }
   
   var form = YAHOO.inputEx(options);
   
   return form;
};

