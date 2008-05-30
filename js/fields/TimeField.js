(function() {

   var inputEx = YAHOO.inputEx, Event = YAHOO.util.Event, lang = YAHOO.lang;

/**
 * @class A field limited to number inputs (floating)
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.TimeField = function(options) {
   inputEx.TimeField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.TimeField, inputEx.Field, 
/**
 * @scope inputEx.TimeField.prototype   
 */
{

   render: function() {
      inputEx.TimeField.superclass.render.call(this);
      this.divEl.appendChild(inputEx.cn('div', null, {clear: 'both'}, ''));
   },

   renderComponent: function() {
      
      var h = [];
      for(var i = 0 ; i < 24 ; i++) { var s="";if(i<10){s="0";} s+= i;h.push(s);}
      this.hoursField = new inputEx.SelectField({name: 'hours', selectOptions: h, selectValues: h});
      var el = this.hoursField.getEl();
      YAHOO.util.Dom.setStyle(el,'float', 'left');
      this.divEl.appendChild(el);
      
      
      var m = [];
      for(var i = 0 ; i < 60 ; i++) { var s="";if(i<10){s="0";} s+= i;m.push(s);}
      this.minutesField = new inputEx.SelectField({name: 'minutes', selectOptions: m, selectValues: m});
      var el = this.minutesField.getEl();
      YAHOO.util.Dom.setStyle(el,'float', 'left');
      var span = inputEx.cn('span', null, null, ":");
      YAHOO.util.Dom.setStyle(span,'float', 'left');
      this.divEl.appendChild(span);
      this.divEl.appendChild(el);
      
      
      var secs = [];
      for(var i = 0 ; i < 60 ; i++) { var s="";if(i<10){s="0";} s+= i;secs.push(s);}
      this.secondsField = new inputEx.SelectField({name: 'seconds', selectOptions: secs, selectValues: secs});
      var el = this.secondsField.getEl();
      YAHOO.util.Dom.setStyle(el,'float', 'left');
      var span = inputEx.cn('span', null, null, ":");
      YAHOO.util.Dom.setStyle(span,'float', 'left');
      this.divEl.appendChild(span);
      this.divEl.appendChild(el);
   },
   
   getValue: function() {
      return ([this.hoursField.getValue(), this.minutesField.getValue(), this.secondsField.getValue()]).join(':');
   },

   setValue: function(str) {
      var a = str.split(':');
      this.hoursField.setValue(a[0]);
      this.minutesField.setValue(a[1]);
      this.secondsField.setValue(a[2]);
   }

});



/**
 * Register this class as "time" type
 */
inputEx.registerType("time", inputEx.TimeField);

})();