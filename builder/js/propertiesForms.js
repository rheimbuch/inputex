

YAHOO.inputEx.builder.propertiesForms = [];


/**
 * Default Form
 */
YAHOO.inputEx.builder.DefaultForm = {};
YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.builder.DefaultForm] = function(field) {

   var labelValue = field ? (field.label || "") : "";

   var formOptions = { inputs: [ 
      {label: "Label", inputParams: {name: "label", value: labelValue} } ,
      {label: "Required ?", type: YAHOO.inputEx.checkBox, inputParams: {name: "required"} } 
   ] };   
   YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.builder.DefaultForm].superclass.constructor.call(this, formOptions);
};

YAHOO.extend(YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.builder.DefaultForm], YAHOO.inputEx.Form);

YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.builder.DefaultForm].prototype.getInputField = function() {
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
YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.HiddenField] = function(field) {
   var formOptions = { inputs: [ ]};
   YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.HiddenField].superclass.constructor.call(this, formOptions);
};
YAHOO.extend(YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.HiddenField], YAHOO.inputEx.Form);

YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.HiddenField].prototype.getInputField = function() {
   return {label: "", inputParams: {} };
};


/**
 * Select Field
 */
YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.SelectField] = function(field) {
 var labelValue = field ? (field.label || "") : "";
   var formOptions = { inputs: [ 
      {label: "Label", inputParams: {name: "label", value: labelValue} } ,
      {label: "Required ?", type: YAHOO.inputEx.checkBox, inputParams: {name: "required"} },
      {label: "Options (comma separated)", inputParams: {name: "options"} }
   ]};
   YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.SelectField].superclass.constructor.call(this, formOptions);
};
YAHOO.extend(YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.SelectField], YAHOO.inputEx.Form);

YAHOO.inputEx.builder.propertiesForms[YAHOO.inputEx.SelectField].prototype.getInputField = function() {
   var value = this.getValue();
   var input = {label: value.label, inputParams: {} };
   if(value.required == 'Y') {
      input.inputParams.required = true;
   }
   //console
   input.inputParams.selectValues = value.options.split(',');
   
   return input;
};
