(function () {
     var inputEx = YAHOO.inputEx;
     
/**
 * @class Create a slider using YUI widgets
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.SliderField = function(options) {
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
   },
      
   /**
    * render a slider widget
    */
   render: function() {
      this.divEl = inputEx.cn('div', {className: this.options.className});
            
      if(!inputEx.SliderField.instanceNbr) { inputEx.SliderField.instanceNbr = 0;}
      this.id = "inputEx-Slider-"+inputEx.SliderField.instanceNbr;
      inputEx.SliderField.instanceNbr+=1;
            
      this.sliderbg = inputEx.cn('div', {id: this.id, className: 'inputEx-SliderField-bg'});
      this.sliderthumb = inputEx.cn('div', {className: 'inputEx-SliderField-thumb'} );
            
      this.sliderbg.appendChild(this.sliderthumb);
      this.divEl.appendChild(this.sliderbg);
            
      this.slider = YAHOO.widget.Slider.getHorizSlider(this.sliderbg, this.sliderthumb, 0, 200);       
   },
        
   //setValue: function(val) {},

   /**
    * Get the value from the slider
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
