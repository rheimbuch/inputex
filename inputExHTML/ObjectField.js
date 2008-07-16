/**
 * @class list of PairField where where the returned value is converted to an object
 * @extends inputEx.ListField
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
YAHOO.inputEx.ObjectField = function(options) {
	options.elementType = {
		type: 'pair', 
		inputParams: {
			leftFieldOptions: {type: 'string', inputParams: {size: 10} }, 
			rightFieldOptions: {type:'string', inputParams: {size: 10} } 
		} 
	};
	YAHOO.inputEx.ObjectField.superclass.constructor.call(this, options);
};

YAHOO.extend(YAHOO.inputEx.ObjectField, YAHOO.inputEx.ListField, {

   /**
    * Convert the array of 2d elements to an javascript object 
    */
   getValue: function() {
   	var v = YAHOO.inputEx.ObjectField.superclass.getValue.call(this);
   	var obj = {};
   	for(var i = 0 ; i < v.length ; i++) {
   		obj[ v[i][0] ] = v[i][1];
   	}
   	return obj;
   },

   /**
    * Convert the object into a list of pairs
    */
   setValue: function(v) {
   	var val = [];
   	for(var key in v) {
   		if( v.hasOwnProperty(key) ) {
   			val.push([key, v[key]]);
   		}
   	}
   	YAHOO.inputEx.ObjectField.superclass.setValue.call(this,val);
   }
});

/**
 * Register this class as "object" type
 */
YAHOO.inputEx.registerType('object', YAHOO.inputEx.ObjectField);