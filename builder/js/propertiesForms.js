

inputEx.builder.propertiesForms = [];


/**
 * Default Form
 */
inputEx.builder.DefaultForm = {};
inputEx.builder.propertiesForms[inputEx.builder.DefaultForm] = function(field) {

   var labelValue = field ? (field.label || "") : "";

   var formOptions = { inputs: [ 
      {label: "Label", inputParams: {name: "label", value: labelValue} } ,
      {label: "Required ?", type: inputEx.checkBox, inputParams: {name: "required"} } 
   ] };   
   inputEx.builder.propertiesForms[inputEx.builder.DefaultForm].superclass.constructor.call(this, formOptions);
};

YAHOO.extend(inputEx.builder.propertiesForms[inputEx.builder.DefaultForm], inputEx.Form);

inputEx.builder.propertiesForms[inputEx.builder.DefaultForm].prototype.getInputField = function() {
   var value = this.getValue();
   var input = {label: value.label, inputParams: {} };
   
   if(value.required == 'Y') {
      input.inputParams.required = true;
   }
   
   return input;
};


/**
 * Hidden Field
 */
inputEx.builder.propertiesForms[inputEx.HiddenField] = function(field) {
   var formOptions = { inputs: [ ]};
   inputEx.builder.propertiesForms[inputEx.HiddenField].superclass.constructor.call(this, formOptions);
};
YAHOO.extend(inputEx.builder.propertiesForms[inputEx.HiddenField], inputEx.Form);

inputEx.builder.propertiesForms[inputEx.HiddenField].prototype.getInputField = function() {
   return {label: "", inputParams: {} };
};


/**
 * Select Field
 */
inputEx.builder.propertiesForms[inputEx.SelectField] = function(field) {
 var labelValue = field ? (field.label || "") : "";
   var formOptions = { inputs: [ 
      {label: "Label", inputParams: {name: "label", value: labelValue} } ,
      {label: "Required ?", type: inputEx.checkBox, inputParams: {name: "required"} },
      {label: "Options (comma separated)", inputParams: {name: "options"} }
   ]};
   inputEx.builder.propertiesForms[inputEx.SelectField].superclass.constructor.call(this, formOptions);
};
YAHOO.extend(inputEx.builder.propertiesForms[inputEx.SelectField], inputEx.Form);

inputEx.builder.propertiesForms[inputEx.SelectField].prototype.getInputField = function() {
   var value = this.getValue();
   var input = {label: value.label, inputParams: {} };
   if(value.required == 'Y') {
      input.inputParams.required = true;
   }
   //console
   input.inputParams.selectValues = value.options.split(',');
   
   return input;
};
