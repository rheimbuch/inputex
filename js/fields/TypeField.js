/**
 * Creates a type field with all the types in inpuEx.typeClasses
 *
 * @class inputEx.TypeField
 * @extends inputEx.SelectField
 * @constructor
 */
inputEx.TypeField = function(options) {
   
   var opts = {};
   for(var key in options) {
      if( options.hasOwnProperty(key) ) {
         opts[key] = options[key];
      }
   }
   // Build the "selectValues" property of SelectField options
   opts.selectValues = [];
   opts.selectOptions = [];
   for(var key in inputEx.typeClasses) {
      opts.selectValues.push( inputEx.typeClasses[key] );
      opts.selectOptions.push( key );
   }
   
   inputEx.TypeField.superclass.constructor.call(this, opts);
   
};

YAHOO.extend(inputEx.TypeField, inputEx.SelectField, {
   
   /**
    * Adds a div to wrap the component
    */
   renderComponent: function() {
      inputEx.TypeField.superclass.renderComponent.call(this);
      
      this.fieldWrapper = inputEx.cn('div');
      this.divEl.appendChild( this.fieldWrapper );
   },
   
   onChange: function() {
      
      // Get value is directly the class !!
      var classO = this.getValue();
      
      // Instanciate the field
      
      this.fieldWrapper.innerHTML = "";
      
      if(classO.groupOptions) {
         if(this.group) {
            this.group.close();
         }
         this.group = new inputEx.Group(classO.groupOptions);
         this.fieldWrapper.appendChild( this.group.getEl() );
      }
   },
   
   
   createField: function() {
   
      var classO = this.getValue();
      
      var opts = this.group.getValue();
      console.log(opts);
      
      var newField = new classO(opts);
      this.fieldWrapper.appendChild( newField.getEl() );
   }
   
});


/**
 * Register this class as "select" type
 */
inputEx.registerType("type", inputEx.TypeField);





/**
 * group Options for each field
 */
 
inputEx.Field.groupOptions = [
   { label: 'Numbers Only', type: inputEx.CheckBox, inputParams: {name: 'numbersOnly'} } 
];


inputEx.SelectField.groupOptions = [
   {  type: inputEx.ListField, inputParams: {name: 'selectValues', listLabel: 'selectValues', elementType: inputEx.Field, elementOptions: {}, required: true} },
   {  type: inputEx.ListField, inputParams: {name: 'selectOptions', listLabel: 'selectOptions', elementType: inputEx.Field, elementOptions: {} } }
];


inputEx.ListField.groupOptions = [
   { name: 'type', label: 'of type', type: inputEx.TypeField, inputParams: {required: true} } 
];
