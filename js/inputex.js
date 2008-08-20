/** 
 * @fileoverview Main inputEx file. Define inputEx namespace in YAHOO.inputEx
 */
(function() {
 
 var lang = YAHOO.lang;
 
/**
 * @namespace The inputEx global namespace object.
 */
YAHOO.namespace("inputEx");

/**
 * Test de documentation inputEx
 */
var inputEx = YAHOO.inputEx;

lang.augmentObject(inputEx, 
/**
 * @scope inputEx
 */   
{
   
   VERSION: "0.1.1b",
   
   /**
    * Url to the spacer image. This url schould be changed according to your project directories
    * @type String
    */
   spacerUrl: "images/space.gif", // 1x1 px
   
   /**
    * Field empty state constant
    * @type String
    */
   stateEmpty: 'empty',
   
   /**
    * Field required state constant
    * @type String
    */
   stateRequired: 'required',
   
   /**
    * Field valid state constant
    * @type String
    */
   stateValid: 'valid',
   
   /**
    * Field invalid state constant
    * @type String
    */
   stateInvalid: 'invalid',
   
   /**
    * Associative array containing field messages
    */
   messages: {
   	required: "This field is required",
   	invalid: "This field is invalid",
   	valid: "This field is valid"
   },
   
   /**
    * @namespace inputEx widget namespace
    */
   widget: {},
   
   /**
    * Associative array containing common regular expressions
    */
   regexps: {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ipv4: /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/,
      url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i,
      password: /^[0-9a-zA-Z\x20-\x7E]*$/
   },
   
   /**
    * Hash between inputEx types and classes (ex: <code>inputEx.typeClasses.color = inputEx.ColorField</code>)<br />
    * Please register the types with the <code>registerType</code> method
    */
   typeClasses: {},
   
   /**
    * When you create a new inputEx Field Class, you can register it to give it a simple type.
    * ex:   inputEx.registerType("color", inputEx.ColorField);
    * @static
    */
   registerType: function(type, field) {
      if(!lang.isString(type)) {
         throw new Error("inputEx.registerType: first argument must be a string");
      }
      if(!lang.isFunction(field)) {
         throw new Error("inputEx.registerType: second argument must be a function");
      }
      this.typeClasses[type] = field;
   },
   
   /**
    * Returns the class for the given type
    * ex: inputEx.getFieldClass("color") returns inputEx.ColorField
    * @static
    */
   getFieldClass: function(type) {
      if(lang.isFunction(this.typeClasses[type])) {
         return this.typeClasses[type];
      }
      return null;
   },
   
   /**
    * Get the inputex type for the given class (ex: <code>inputEx.getType(inputEx.ColorField)</code> returns "color")
    * @static
    * @param {inputEx.Field} FieldClass An inputEx.Field or derivated class
    * @return {String} returns the inputEx type string or <code>null</code>
    */
   getType: function(FieldClass) {
      for(var type in this.typeClasses) {
         if(this.typeClasses.hasOwnProperty(type) ) {
            if(this.typeClasses[type] == FieldClass) {
               return type;
            }
         }
      }
      return null;
   },
   
   /**
    * Build a field from an object like: { type: 'color' or fieldClass: inputEx.ColorField, inputParams: {} }<br />
    * The inputParams property is the object that will be passed as the <code>options</code> parameter to the field class constructor.<br />
    * If the neither type or fieldClass are found, it uses inputEx.StringField
    * @static
    * @param {Object} fieldOptions
    * @return {inputEx.Field} Created field instance
    */
   buildField: function(fieldOptions) {
      var fieldClass = null;
   	if(fieldOptions.type) {
   	   fieldClass = this.getFieldClass(fieldOptions.type);
   	   if(fieldClass === null) fieldClass = inputEx.StringField;
   	}
   	else {
   	   fieldClass = fieldOptions.fieldClass ? fieldOptions.fieldClass : inputEx.StringField;
   	}

      // Instanciate the field
      var inputInstance = new fieldClass(fieldOptions.inputParams);
   	  
      return inputInstance;
   },
   
   /**
    * Helper function to set DOM node attributes and style attributes.
    * @static
    * @param {HTMLElement} el The element to set attributes to
    * @param {Object} domAttributes An object containing key/value pairs to set as node attributes (ex: {id: 'myElement', className: 'myCssClass', ...})
    * @param {Object} styleAttributes Same thing for style attributes. Please use camelCase for style attributes (ex: backgroundColor for 'background-color')
    */
   sn: function(el,domAttributes,styleAttributes){
      if(!el) { return; }

      if(domAttributes){
         for(var i in domAttributes){
            var domAttribute = domAttributes[i];
            if( lang.isFunction(domAttribute) ){
               continue;
            }
            /*if(YAHOO.env.ua.ie && i=="type" && (el.tagName=="INPUT"||el.tagName=="SELECT") ){
               continue;
            }*/
            if(i=="className"){
               i="class";
               el.className=domAttribute;
            }
            if(domAttribute!==el.getAttribute(i)){
               try{
                  if(domAttribute===false){
                     el.removeAttribute(i);
                  }else{
                     el.setAttribute(i,domAttribute);
                  }
               }
               catch(err){
                  //console.log("WARNING: WireIt.sn failed for "+el.tagName+", attr "+i+", val "+domAttribute);
               }
            }
         }
      }

      if(styleAttributes){
         for(var i in styleAttributes){
            if( lang.isFunction(styleAttributes[i]) ){
               continue;
            }
            if(el.style[i]!=styleAttributes[i]){
               el.style[i]=styleAttributes[i];
            }
         }
      }
   },


   /**
    * Helper function to create a DOM node. (wrapps the document.createElement tag and the inputEx.sn functions)
    * @static
    * @param {String} tag The tagName to create (ex: 'div', 'a', ...)
    * @param {Object} [domAttributes] see inputEx.sn
    * @param {Object} [styleAttributes] see inputEx.sn
    * @param {String} [innerHTML] The html string to append into the created element
    * @return {HTMLElement} The created node
    */
   cn: function(tag, domAttributes, styleAttributes, innerHTML){
      var el=document.createElement(tag);
      this.sn(el,domAttributes,styleAttributes);
      if(innerHTML){
         el.innerHTML = innerHTML;
      }
      return el;
   },
   
   
   /**
    * Find the position of the given element. (This method is not available in IE 6)
    * @static
    * @param {Object} el Value to search
    * @param {Array} arr The array to search
    * @return {number} Element position, -1 if not found
    */
   indexOf: function(el,arr) {
      var l=arr.length,i;
      for(i = 0 ;i < l ; i++) {
         if(arr[i] == el) return i;
      }
      return -1;
   },

   
   /**
    * Create a new array without the null or undefined values
    * @static
    * @param {Array} arr The array to compact
    * @return {Array} The new array
    */
   compactArray: function(arr) {
      var n = [], l=arr.length,i;
      for(i = 0 ; i < l ; i++) {
         if( !lang.isNull(arr[i]) && !lang.isUndefined(arr[i]) ) {
            n.push(arr[i]);
         }
      }
      return n;
   }
   
});

})();


/**
 * The main inputEx namespace
 */
var inputEx = YAHOO.inputEx;
// this previous line is just for documentation purposes. It should be removed from the production files
