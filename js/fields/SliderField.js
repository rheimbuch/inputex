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
 * render a slider widget
 */
render: function() {
   this.divEl = inputEx.cn('div');
            
   this.sliderbg = inputEx.cn('div');
   this.sliderthumb = inputEx.cn('div');
            
   this.sliderbg.appendChild(this.sliderthumb);
   this.divEl.appendChild(this.sliderbg);
            
   this.slider = YAHOO.widget.Slider.getHorizSlider(this.sliderbg, this.sliderthumb, 0, 200); 
            
}/*,
        
setValue: function(val) {},
        
getValue: function() {}*/
    
});

/**
 * Register this class as "slider" type
 */
inputEx.registerType("slider", inputEx.SliderField);

})();
