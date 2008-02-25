/**
 * Define firebug functions as empty functions if firebug is not present
 */
/*if (!window.console || !console.firebug) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    window.console = {};
    for (var i = 0; i < names.length; ++i) {
        window.console[names[i]] = function() {};
    }
}*/

/** 
 * @fileoverview This files declares the main namespace of {@link http://javascript.neyric.com/inputex inputEx}
 */
var inputEx =  {
   
   /**
    * Url to the spacer image
    */
   spacerUrl: "images/space.gif", // 1x1 px
   
   /**
    * Field States
    */
   stateEmpty: 'empty',
   stateRequired: 'required',
   stateValid: 'valid',
   stateInvalid: 'invalid',
   
   /**
    * Shared messages
    */
   messages: {
   	required: "This field is required",
   	invalid: "This field is invalid",
   	valid: "This field is valid"
   },
   
   /**
    * Regular expressions
    */
   regexps: {
      email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ipv4: /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/,
      url: /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/i
   },
   
   /**
    * Associative array to convert types to classes
    */
   typeClasses: {
      /*
      color: inputEx.ColorField,
      ...
      */
   },
   
   /**
    * When you create a new inputEx Field Class, you can register it to give it a simple type.
    * ex:   inputEx.registerType("color", inputEx.ColorField);
    */
   registerType: function(type, field) {
      if(typeof type != "string") {
         throw new Error("inputEx.registerType: first argument must be a string");
      }
      if(typeof field != "function") {
         throw new Error("inputEx.registerType: second argument must be a function");
      }
      this.typeClasses[type] = field;
   },
   
   /**
    * Returns the class for the given type
    * ex: inputEx.getFieldClass("color") returns inputEx.ColorField
    */
   getFieldClass: function(type) {
      if(typeof this.typeClasses[type] == "function") {
         return this.typeClasses[type];
      }
      return null;
   },
   
   /**
    * Get the type for the given class: ex, inputEx.getType(inputEx.ColorField) returns "color"
    */
   getType: function(FieldClass) {
      for(var type in this.typeClasses) {
         if(this.typeClasses.hasOwnProperty(type) ) {
            if(this.typeClasses[FieldClass]) {
               return type;
            }
         }
      }
      return null;
   },
   
   /**
    * Functions used to create nodes
    * and set node attributes
    */
   sn: function(el,domAttributes,styleAttributes){
      if(!el) { return; }

      if(domAttributes){
         for(var i in domAttributes){
            var domAttribute = domAttributes[i];
            if(typeof (domAttribute)=="function"){
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
            if(typeof (styleAttributes[i])=="function"){
               continue;
            }
            if(el.style[i]!=styleAttributes[i]){
               el.style[i]=styleAttributes[i];
            }
         }
      }
   },


   /**
    * Create Node
    */
   cn: function(tag, domAttributes, styleAttributes, innerHTML){
      var el=document.createElement(tag);
      this.sn(el,domAttributes,styleAttributes);
      if(innerHTML){
         el.innerHTML = innerHTML;
      }
      return el;
   }
   
};



if(!Array.prototype.indexOf) {
   /**
    * The method Array.indexOf doesn't exist on IE :(
    */
   Array.prototype.indexOf = function(el) {
      for(var i = 0 ;i < this.length ; i++) {
         if(this[i] == el) return i;
      }
      return -1;
   };
}

if(!Array.prototype.compact) {
   /**
    * Compact
    */
   Array.prototype.compact = function() {
      var n = [];
      for(var i = 0 ; i < this.length ; i++) {
         if(this[i]) {
            n.push(this[i]);
         }
      }
      return n;
   };
}
