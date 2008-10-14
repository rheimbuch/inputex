(function() {

   var inputEx = YAHOO.inputEx;

/**
 * @class Create a uneditable field where you can stick the html you want
 * Added Options:
 * <ul>
 *    <li>formatValue: String function(value)</li>
 *    <li>formatDom: DOMEl function(value)</li>
 * </ul>
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.UneditableField = function(options) {
	inputEx.UneditableField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.UneditableField, inputEx.Field, 
/**
 * @scope inputEx.UneditableField.prototype   
 */
{
   /**
    * Minimal rendering
    */
   /*render: function() {
      this.divEl = inputEx.cn('div');
   },*/
   
   /**
    * Store the value and update the visu
    * @param {Any} val The value that will be sent to the visu
    */
   setValue: function(val) {
      this.value = val;
      
      inputEx.renderVisu(this.options.visu, val, this.fieldContainer);
      
	   inputEx.UneditableField.superclass.setValue.call(this, val);
   },
   
   /**
    * Return the stored value
    * @return {Any} The previously stored value
    */
   getValue: function() {
      return this.value;
   }
   
});

/**
 * Register this class as "url" type
 */
inputEx.registerType("uneditable", inputEx.UneditableField);

})();