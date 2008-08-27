(function () {
     var inputEx = YAHOO.inputEx,lang=YAHOO.lang;
     
/**
 * @class Create a slider using YUI widgets
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.SliderField = function(options) {
   console.log("instanciating slider");
   inputEx.SliderField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.SliderField, inputEx.Field, 
/**
 * @scope inputEx.SliderField.prototype   
 */  
{
   /**
    * Set the classname to 'inputEx-SliderField'
    */
   setOptions: function() {
	   this.options.className = this.options.className || 'inputEx-SliderField';
      inputEx.SliderField.superclass.setOptions.call(this);
      
      this.options.minValue = lang.isUndefined(this.options.minValue) ? 0 : this.options.minValue;
      this.options.maxValue = lang.isUndefined(this.options.maxValue) ? 100 : this.options.maxValue;
      
      this.options.displayValue = lang.isUndefined(this.options.displayValue) ? true : this.options.displayValue;
   },
      
   /**
    * render a slider widget
    */
   render: function() {
      this.divEl = inputEx.cn('div', {className: this.options.className});
      
      
      if(this.options.displayValue) {
         this.valueDisplay = inputEx.cn('div', null, {display:'inline'}, String(this.options.minValue) );
         this.divEl.appendChild(this.valueDisplay);
      }
      
      if(!inputEx.SliderField.instanceNbr) { inputEx.SliderField.instanceNbr = 0;}
      this.id = "inputEx-Slider-"+inputEx.SliderField.instanceNbr;
      inputEx.SliderField.instanceNbr+=1;
            
      this.sliderbg = inputEx.cn('div', {id: this.id, className: 'inputEx-SliderField-bg'});
      this.sliderthumb = inputEx.cn('div', {className: 'inputEx-SliderField-thumb'} );
      
      // Set the size dynamically
      YAHOO.util.Dom.setStyle(this.sliderbg,'width', (this.options.maxValue+12)+'px');
            
      this.sliderbg.appendChild(this.sliderthumb);
      this.divEl.appendChild(this.sliderbg);
            
            
      this.slider = YAHOO.widget.Slider.getHorizSlider(this.sliderbg, this.sliderthumb, this.options.minValue, this.options.maxValue);       
      
   },
   
   initEvents: function() {
      
      // Fire the updated event when we released the slider
      // the slider 'change' event would generate too much events (if used in a group, it gets validated too many times)
      this.slider.on('slideEnd', this.fireUpdatedEvt, this, true);
      
      // Update the displayed value
      if(this.options.displayValue) {
         this.updatedEvt.subscribe( function(e,val) {
            this.valueDisplay.innerHTML = val;
         }, this, true);
      }
   },
        
   setValue: function(val) {
      
   },

   /**
    * Get the value from the slider
    * @return {int} The integer value
    */
   getValue: function() {
      return this.slider.getValue();
   }
    
});

/**
 * Register this class as "slider" type
 */
inputEx.registerType("slider", inputEx.SliderField);

})();
