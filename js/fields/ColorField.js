(function() {
	
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;
	
/**
 * @class Create a Color picker input field
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.ColorField = function(options) {
	inputEx.ColorField.superclass.constructor.call(this,options);
};
lang.extend(inputEx.ColorField, inputEx.Field, 
/**
 * @scope inputEx.ColorField.prototype   
 */
{
	/**
	 * Render the color button and the colorpicker popup
	 */
	renderComponent: function() {
	      
	   // A hidden input field to store the color code 
	   this.el = inputEx.cn('input', {
	      type: 'hidden', 
	      name: this.options.name || '', 
	      value: this.options.value || '#DD7870' });
	   	   
	   // Create a colored area
	   this.colorEl = inputEx.cn('div', {className: 'inputEx-ColorField'}, {backgroundColor: this.el.value});
	
	   // Render the popup
	   this.renderPopUp();
	
	   // Elements are bound to divEl
	   this.divEl.appendChild(this.el);
	   this.divEl.appendChild(this.colorEl);
	},
	   
	/**
	 * Register the click and blur events
	 */
	initEvents: function() {
	   Event.addListener(this.colorEl, "click", this.toggleColorPopUp, this, true);
	   Event.addListener(this.colorEl, "blur", this.closeColorPopUp, this, true);
	},
	   
	/**
	 * Toggle the color picker popup 
	 */
	toggleColorPopUp: function() {
	   if( this.visible ) {	this.colorPopUp.style.display = 'none'; }
	   else { this.colorPopUp.style.display = 'block'; }
	   this.visible = !this.visible;
	},
	
	/**
	 * Call closeColorPopUp when field is removed
	 */
	close: function() {
	   this.closeColorPopUp();
	},
	
	/**
	 * Close the popup
	 */
	closeColorPopUp: function() {
		this.colorPopUp.style.display = 'none';
		this.visible = false;
	},
	   
	/**
	 * Render the color popup
	 */
	renderPopUp: function() {
	
	  // display or not the title
	  this.displayTitle = this.options.displayTitle || false;
	
		// set default color grid  to be used
		var defaultGrid = this.options.auto || 1;
	
		// set colors available
		this.colors = this.options.colors || this.setDefaultColors(defaultGrid);
		this.length = this.colors.length;
	
		// set PopUp size ratio (default 16/9 ratio)
		this.ratio = this.options.ratio || [16,9];
	
		// set color grid dimensions
		this.squaresPerLine = Math.ceil(Math.sqrt(this.length*this.ratio[0]/this.ratio[1]));
		this.squaresPerColumn = Math.ceil(this.length/this.squaresPerLine);
		this.squaresOnLastLine = this.squaresPerLine - (this.squaresPerLine*this.squaresPerColumn-this.length);
	
		// set popup width
		var width = 30*this.squaresPerLine+10;
	
		// keep the visible state of the popup
		this.visible = false;
	
		// create the popup
		this.colorPopUp = inputEx.cn('div', {className: 'inputEx-ColorField-popup'}, {width: width+'px', display: 'none'});
	
		// create the title
		if (this.displayTitle) {
	      var div = inputEx.cn('div', null, null, inputEx.messages.selectColor);
	      this.colorPopUp.appendChild( div );
	   }
	
	   var body = inputEx.cn('div');
	   body.appendChild( this.renderColorGrid() );
	   this.colorPopUp.appendChild(body);
	
	   this.divEl.appendChild(this.colorPopUp);
	},
	   
	/**
	 * Set the value
	 * @param {String} value Color to set
	 */
	setValue: function(value) {
	   this.el.value = value;
	   Dom.setStyle(this.colorEl, 'background-color', this.el.value);
	},
	   
	/**
	 * Set the colors to set in the picker 
	 * @param {int} index Index of the palette to use
	 * @return {Array} List of colors to choose from
	 */
	setDefaultColors: function(index) {
		return inputEx.ColorField.palettes[index-1];
	},
	      
	/**
	 * This creates a color grid
	 */
	renderColorGrid: function() {
		var table = inputEx.cn('table');
		var tbody = inputEx.cn('tbody');
		for(var i = 0; i<this.squaresPerColumn; i++) {
			var line = inputEx.cn('tr');
			for(var j = 0; j<this.squaresPerLine; j++) {
	
	   		// spacer cells
	   		line.appendChild( inputEx.cn('td', null, {backgroundColor: '#fff', lineHeight: '10px', cursor: 'default'}, "&nbsp;") );
	
	   		// fill remaining space with empty and inactive squares
	   		var square = inputEx.cn('td', null, {backgroundColor: '#fff', lineHeight: '10px', cursor: 'default'}, '&nbsp;&nbsp;&nbsp;');
	
	   	    if (i===(this.squaresPerColumn-1) && j>=this.squaresOnLastLine ) {
	   	       inputEx.sn(square, null, {backgroundColor: '#fff', cursor: 'default'});
	   		 } 
	   		 else {
	   		   // create active squares
	   	      inputEx.sn(square, null, {backgroundColor: '#'+this.colors[i*this.squaresPerLine+j], cursor: 'pointer'});
	   			Event.addListener(square, "mousedown", this.onColorClick, this, true );
	   		 }   
	          line.appendChild(square);
	   	}
	   	tbody.appendChild(line);
	
	   	// spacer line
	   	tbody.appendChild( inputEx.cn('tr', null, {height: '8px'}) );
	   }
	   table.appendChild(tbody);
	   return table;
	},
	   
	/**
	 * Handle a color selection
	 * @param {Event} e The original click event
	 */
	onColorClick: function(e) {
	      
		var square = Event.getTarget(e);//e.target;
	   	
		var couleur = Dom.getStyle(square,'background-color'); 
		Dom.setStyle(this.colorEl,'background-color',couleur);
	   	
		// set hidden field value
		// Convertit une chaine du style "rgb(255,142,0)" en hexadecimal du style "#FF8E00"
	  	var hexa = function (rgbcolor) {
		// Convertit un entier en hexa
		var DecToHex = function (n){
	     var tblCode = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E","F");
	        var BASE=16;
	        var Num = parseInt(n, 10);
	        var i;
	        var strHex = "";
	        if (! isNaN(Num)){
	   	    if(Num == '') return "00"; 
	          while (Num>0){
	             i=0;
	             while(Num/Math.pow(BASE, i++)>=BASE);
	             strHex += tblCode[Math.floor(Num/Math.pow(BASE, i-1))];
	             if (Num%BASE==0) strHex+="0";
	             Num = (Num % Math.pow(BASE, i-1));
	          }
	   	    if(strHex.length == 1) {return '0'+strHex;}
	          return strHex;
	        }
	        else return 0;
	      };
	      
	      var rgb = rgbcolor.split(/([(,)])/);
	      return '#'+DecToHex(rgb[2])+DecToHex(rgb[4])+DecToHex(rgb[6]);
	   };
	     
	   this.el.value = hexa(couleur);
	
	   // Overlay closure
	   this.visible = !this.visible;
	   this.colorPopUp.style.display = 'none';
	   	
	   // Fire updated
	   this.fireUpdatedEvt();
	}
	  
}); 
	
// Specific message for the container
inputEx.messages.selectColor = "Select a color :";
	
/**
 * Default palettes
 */
inputEx.ColorField.palettes = [
   ["FFEA99","FFFF66","FFCC99","FFCAB2","FF99AD","FFD6FF","FF6666","E8EEF7","ADC2FF","ADADFF","CCFFFF","D6EAAD","B5EDBC","CCFF99"],
   ["55AAFF","FFAAFF","FF7FAA","FF0202","FFD42A","F9F93B","DF8181","FEE3E2","D47FFF","2AD4FF","2AFFFF","AAFFD4"],
   ["000000","993300","333300","003300","003366","000080","333399","333333","800000","FF6600","808000","008000","008080","0000FF","666699","808080","FF0000","FF9900","99CC00","339966","33CCCC","3366FF","800080","969696","FF00FF","FFCC00","FFFF00","00FF00","00FFFF","00CCFF","993366","C0C0C0","FF99CC","FFCC99","FFFF99","CCFFCC","CCFFFF","99CCFF","CC99FF","F0F0F0"]
];	
	
/**
 * Register this class as "color" type
 */
inputEx.registerType("color", inputEx.ColorField);
	
})();