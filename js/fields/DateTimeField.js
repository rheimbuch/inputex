(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class A field limited to number inputs (floating)
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options No added options
 */
inputEx.DateTimeField = function(options) {
   inputEx.DateTimeField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.DateTimeField, inputEx.Field, 
/**
 * @scope inputEx.DateTimeField.prototype   
 */
{

   /**
    * Insert a 'breaker' (div with 'clear: both' css attribute)
    */
   render: function() {
      inputEx.DateTimeField.superclass.render.call(this);
      this.divEl.appendChild(inputEx.cn('div', null, {clear: 'both'}, ''));
   },

   /**
    * Render a DateField and a TimeField
    */
   renderComponent: function() {
      
      this.dateField = new inputEx.DateField({name: 'date'});
      var el = this.dateField.getEl();
      YAHOO.util.Dom.setStyle(el,'float', 'left');
      YAHOO.util.Dom.setStyle(el,'margin-right', '10px');
      this.divEl.appendChild(el);
      
      this.timeField = new inputEx.TimeField({name: 'time'});
      var el = this.timeField.getEl();
      YAHOO.util.Dom.setStyle(el,'float', 'left');
      this.divEl.appendChild(el);

   },
   
   /**
    * Concat the values to return a date
    * @return {Date} The javascript Date object
    */
   getValue: function() {
      var d = this.dateField.getValue();
      if( d == '' ) return null;
      var a = this.timeField.getValue().split(':');
      
      d.setHours(a[0]);
      d.setMinutes(a[1]);
      d.setSeconds(a[2]);
      
      return d;
   },

   /**
    * Set the value of both subfields
    * @param {Date} val Date to set
    */
   setValue: function(val) {
      this.dateField.setValue(val);
      this.timeField.setValue( ([val.getHours(), val.getMinutes(), val.getSeconds()]).join(':') );
   }

});



/**
 * Register this class as "time" type
 */
inputEx.registerType("datetime", inputEx.DateTimeField);

})();