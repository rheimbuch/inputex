

/**
 * @class YAHOO.inputEx.UpperCaseField
 * Create a field where the value is always uppercase
 */
YAHOO.inputEx.UpperCaseField = function(options) {
   YAHOO.inputEx.UpperCaseField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.UpperCaseField, YAHOO.inputEx.Field);

YAHOO.inputEx.UpperCaseField.prototype.onInput = function(e) { 
	this.setValue( (this.getValue()).toUpperCase() );
	this.setClassFromState();
};



/**
 * @class YAHOO.inputEx.UneditableHtmlField
 * Create a uneditable field where you can stick the html you want
 */
YAHOO.inputEx.UneditableHtmlField = function(options) {
	YAHOO.inputEx.UneditableHtmlField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.UneditableHtmlField, YAHOO.inputEx.Field);

YAHOO.inputEx.UneditableHtmlField.prototype.render = function() {
   this.divEl = document.createElement('DIV');
};

YAHOO.inputEx.UneditableHtmlField.prototype.setValue = function(val) {
   this.value = val;
   if(this.options.formatValue) {
      this.divEl.innerHTML = this.options.formatValue(val);
   }
   else if(this.options.formatDom) {
      var r = this.options.formatDom(val);
      this.divEl.innerHTML = "";
      if(r) this.divEl.appendChild(r);
   }
   else {
      this.divEl.innerHTML = val;
   }
};

YAHOO.inputEx.UneditableHtmlField.prototype.getValue = function() {
   return this.value;
};



/**
 * @class YAHOO.inputEx.SelectField
 * Create a <select> input, inherits from YAHOO.inputEx.Field
 *
 * options:
 *		- selectValues: contains the list of <options> values
 */
YAHOO.inputEx.SelectField = function(options) {
	YAHOO.inputEx.SelectField.superclass.constructor.call(this,options);
  };
YAHOO.lang.extend(YAHOO.inputEx.SelectField, YAHOO.inputEx.Field);

YAHOO.inputEx.SelectField.prototype.render = function() {
   this.divEl = document.createElement('DIV');
   this.el = document.createElement('SELECT');
   this.el.name = this.options.name || '';
   if (this.options.multiple) {this.el.multiple = true; this.el.size = this.options.selectValues.length;}
   this.optionEls = [];
   for( var i = 0 ; i < this.options.selectValues.length ; i++) {
      this.optionEls[i] = document.createElement('OPTION');
      this.optionEls[i].value = this.options.selectValues[i];
      this.optionEls[i].innerHTML = (this.options.selectOptions) ? this.options.selectOptions[i] : this.options.selectValues[i];
      this.el.appendChild(this.optionEls[i]);
   }
   this.divEl.appendChild(this.el);
};

YAHOO.inputEx.SelectField.prototype.setValue = function(val) {
   var index = 0;
   var option;
   for(var i = 0 ; i < this.options.selectValues.length ; i++) {
      if(val === this.options.selectValues[i]) {
         option = this.el.childNodes[i];
		 option.selected = "selected";
      }
   }
};

/**
 * @class YAHOO.inputEx.checkBox
 * Create a <checkbox> input, inherits from YAHOO.inputEx.Field
 *
 * options:
 *		- checked: true or false
 *		- sentValues: contains a list of two strings to be returned if checked or unchecked (ex: sentValues:['Returned_if_checked','Returned_if_unchecked'])
 */
YAHOO.inputEx.checkBox = function(options) {
	YAHOO.inputEx.checkBox.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.checkBox, YAHOO.inputEx.Field);

YAHOO.inputEx.checkBox.prototype.render = function() {
  
  this.sentValues = this.options.sentValues || ['Y','N'];
  this.checkedValue = this.sentValues[0];
  this.uncheckedValue = this.sentValues[1];

  this.divEl = document.createElement('DIV');

  this.el = document.createElement('INPUT');
  this.el.type = 'checkbox';
  this.el.checked = (this.options.checked === false) ? false : true;
  this.divEl.appendChild(this.el);
  
  this.label = document.createElement('label');
  this.label.innerHTML = this.options.label || '';
  YAHOO.util.Dom.addClass(this.label, 'inputExForm-checkbox-rightLabel');
  this.divEl.appendChild(this.label);
  
  // Keep state of checkbox in a hidden field (format : this.checkedValue or this.uncheckedValue)
  this.hiddenEl = document.createElement('INPUT');
  this.hiddenEl.type = 'hidden';
  this.hiddenEl.name = this.options.name || '';
  this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
  this.divEl.appendChild(this.hiddenEl);

  YAHOO.util.Event.addListener(this.el, "change", this.toggleHiddenEl, this, true);	
};

YAHOO.inputEx.checkBox.prototype.toggleHiddenEl = function() {
   this.hiddenEl.value = this.el.checked ? this.checkedValue : this.uncheckedValue;
};

YAHOO.inputEx.checkBox.prototype.getValue = function() {
   return this.el.checked ? this.checkedValue : this.uncheckedValue;
};

/**
 * Function to set the value
 */
YAHOO.inputEx.checkBox.prototype.setValue = function(val) {
    if (val===this.checkedValue) {
		this.hiddenEl.value = val;
		this.el.checked = true;
	}
    else if (val===this.uncheckedValue) {
		this.hiddenEl.value = val;
		this.el.checked = false;
	}
	else {
	    throw "Wrong value assignment in checkBox input";
	}
};



/**
 * @class YAHOO.inputEx.Textarea
 * Create a <select> input, inherits from YAHOO.inputEx.Field
 *
 * options:
 *		- selectValues: contains the list of <options> values
 */
YAHOO.inputEx.Textarea = function(options) {
	YAHOO.inputEx.Textarea.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.Textarea, YAHOO.inputEx.Field);

YAHOO.inputEx.Textarea.prototype.render = function() {
	this.divEl = document.createElement('DIV');
	this.el = document.createElement('TEXTAREA');
	this.el.value = this.options.value || '';
	this.el.rows = this.options.rows || 6;
	this.el.cols = this.options.cols || 23;
	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');
	this.divEl.appendChild(this.el);
};


/**
 * @class YAHOO.inputEx.HiddenField
 * Create a hidden input, inherits from YAHOO.inputEx.Field
 */
YAHOO.inputEx.HiddenField = function(options) {
	YAHOO.inputEx.HiddenField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.HiddenField, YAHOO.inputEx.Field);

YAHOO.inputEx.HiddenField.prototype.render = function() {
   this.type = YAHOO.inputEx.HiddenField;
	this.divEl = document.createElement('DIV');
	
	this.el = document.createElement('INPUT');
	this.el.type = 'hidden';
  this.el.name = this.options.name || '';

	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');
	
	this.divEl.appendChild(this.el);
};


/**
 * @class YAHOO.inputEx.PasswordField
 * Create a password input, inherits from YAHOO.inputEx.Field
 */
YAHOO.inputEx.PasswordField = function(options) {
	YAHOO.inputEx.PasswordField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.PasswordField, YAHOO.inputEx.Field);

YAHOO.inputEx.PasswordField.prototype.render = function() {
	YAHOO.inputEx.PasswordField.superclass.render.call(this);
	this.el.type = 'password';
};

	
/**
 * @class YAHOO.inputEx.EmailField
 * Adds an email regexp, inherits from YAHOO.inputEx.Field
 */
YAHOO.inputEx.messages.invalidEmail = "Invalid email, ex: sample@test.com";

YAHOO.inputEx.EmailField = function(options) {
	options.messages = options.messages || {};
	options.messages.invalid = YAHOO.inputEx.messages.invalidEmail;
	options.regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	YAHOO.inputEx.EmailField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.EmailField, YAHOO.inputEx.Field);

YAHOO.inputEx.EmailField.prototype.render = function() {
	YAHOO.inputEx.EmailField.superclass.render.call(this);
	this.el.size = 27;
};


/**
 * @class YAHOO.inputEx.IpadressField
 * Adds an IPv4 adress regexp, inherits from YAHOO.inputEx.Field
 */
YAHOO.inputEx.IpadressField = function(options) {
	options.regexp = /^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/;
	YAHOO.inputEx.IpadressField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.IpadressField, YAHOO.inputEx.Field);


/**
 * @class YAHOO.inputEx.FormattedField
 * Uses a format, inherits from YAHOO.inputEx.Field
 * This is used for numbers only.
 *
 * options:
 *		- format: format (zipcode: '#####', date: '##/##/####' )
 */
// Adds the numbers only option
YAHOO.inputEx.FormattedField = function(options) {
	YAHOO.inputEx.FormattedField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.FormattedField, YAHOO.inputEx.Field);

YAHOO.inputEx.FormattedField.prototype.validate = function() { 
	return !this.getFormattedValue().match('_');
};

// Alias for getValue() here, but to getValue will be overriden in Datefield (where formatted value like 10/04/2003 and value is a datetime like 2003-10-4 00:00:00).
YAHOO.inputEx.FormattedField.prototype.getFormattedValue = function() {
	return this.el.value;
};

YAHOO.inputEx.FormattedField.prototype.onInput = function(e) {
	
	var value = this.getFormattedValue();
	
	var v = value.split('');
	var f = this.options.format.split('');
	
	var resultString = '';
	var matching = true;
	var lastMatchedPos = 0;
	for(var i = 0 ; i < f.length ; i++) {
		
		// Check if this char is matching
		if( matching && (	(v.length <= i ) ||
			 					(f[i] == '#' && ("0123456789").indexOf(v[i]) == -1) ||
			 					(f[i] != '#' && f[i] != v[i]) ) ) {
				matching = false;
		}
		
		if( matching ) {
			resultString += v[i];
			// autocomplete
			if ( i+1 < f.length && f[i+1] != '#') {
				resultString += f[i+1];
				i++;
			}
			lastMatchedPos = i+1;
		}
		else {
			resultString += f[i].replace('#','_');
		}
	}
	//this.setValue(resultString);
	this.el.value = resultString;
	this.el.selectionStart = lastMatchedPos;
   this.el.selectionEnd = lastMatchedPos;
	
	this.setClassFromState();
};

YAHOO.inputEx.FormattedField.prototype.initEvents = function() {
	YAHOO.inputEx.FormattedField.superclass.initEvents.call(this);
	YAHOO.util.Event.addListener(this.el, 'keydown', this.onKeyDown, this, true);
};

YAHOO.inputEx.FormattedField.prototype.onKeyDown = function(e) {
	if(e.keyCode == 8) {
		if( this.el.selectionStart == this.el.selectionEnd ) {
			var v = (this.getFormattedValue()).split('');
			if( ("0123456789").indexOf(v[this.el.selectionStart-1]) == -1 ) {
				//this.setValue((this.getFormattedValue()).substr(0,this.el.selectionStart-1) );
            this.el.value = (this.getFormattedValue()).substr(0,this.el.selectionStart-1);
			}
		}
	}
};

YAHOO.inputEx.FormattedField.prototype.onBlur = function(e) {
	YAHOO.inputEx.FormattedField.superclass.onBlur.call(this,e);

	if( this.getFormattedValue() == this.options.format.replace(/#/g,'_') ) {
		//this.setValue('');
      this.el.value = '';
	}

	this.setClassFromState();
};

/**
 * @class YAHOO.inputEx.DateField
 *
 * options: 
 *		- dateFormat: default to 'm/d/Y'
 */
YAHOO.inputEx.DateField = function(options) {
	options.format = '##/##/####';
	options.dateFormat = options.dateFormat || 'm/d/Y';
	YAHOO.inputEx.DateField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.DateField, YAHOO.inputEx.FormattedField);

YAHOO.inputEx.DateField.prototype.validate = function () {
	
	var value = this.el.value;
	if( value.match('_') ) { return false; }
   if (value === "") { return false; }
   var ladate = value.split("/");
   if ((ladate.length != 3) || isNaN(parseInt(ladate[0])) || isNaN(parseInt(ladate[1])) || isNaN(parseInt(ladate[2]))) { return false; }
	 var formatSplit = this.options.dateFormat.split('/');
	 var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
	 var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
	 var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   var unedate = new Date(Y,m,d);
   var annee = unedate.getFullYear();
   return ((unedate.getDate() == d) && (unedate.getMonth() == m) && (annee == Y));
};

YAHOO.inputEx.DateField.prototype.render = function() {
	YAHOO.inputEx.DateField.superclass.render.call(this);
	this.el.size = 10;
};

// Return value in DATETIME format (use getFormattedValue() to have 04/10/2002-like format)
YAHOO.inputEx.DateField.prototype.getValue = function() {
   // Hack to validate if field not required and empty
   if (this.el.value === '') { return '';}
   var ladate = this.getFormattedValue().split("/");
   var formatSplit = this.options.dateFormat.split('/');
   var d = parseInt(ladate[ formatSplit.indexOf('d') ],10);
   var Y = parseInt(ladate[ formatSplit.indexOf('Y') ],10);
   var m = parseInt(ladate[ formatSplit.indexOf('m') ],10)-1;
   return (new Date(Y,m,d));
};

YAHOO.inputEx.DateField.prototype.setValue = function(val) {
   
   // Don't try to parse a date if there is no date
   if( val === '' ) {
      this.el.value = '';
      return;
   }
   
  // DATETIME
	if (val instanceof Date) {
     str = this.options.dateFormat.replace('Y',val.getFullYear());
     str = str.replace('m',val.GetMonthNumberString());
     str = str.replace('d',val.GetDateString());
  } 
  // else date must match this.options.dateFormat
  else {
     str = val;
  }
		
	this.el.value = str;
};

/**
 * YAHOO.inputEx.ColorField
 *
 * @classDescription    Create a ColorPicker input field
 * @inherits            YAHOO.inputEx.Field
 * @param {Object}      same as parent options
 * @constructor
 */
YAHOO.inputEx.messages.selectColor = "Select a color :";
YAHOO.inputEx.ColorField = function(options) {
	YAHOO.inputEx.ColorField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(YAHOO.inputEx.ColorField, YAHOO.inputEx.Field);

/**
 * Create a box that opens a Overlay when clicked
 *
 * @method  render
 * @memberOf         YAHOO.inputEx.ColorField
 */
YAHOO.inputEx.ColorField.prototype.render = function() {

	// Create a DIV element to wrap the editing el and the image
	this.divEl = document.createElement('DIV');

	// A hidden input field to store the color code 
	this.el = document.createElement('INPUT');
	this.el.type = 'hidden';
	this.el.name = this.options.name;
	this.el.value = this.options.value || '#DD7870';
	YAHOO.util.Dom.addClass(this.el, 'inputEx-field');

	// Create a colored area
	this.colorEl = document.createElement('DIV');
	YAHOO.util.Dom.addClass(this.colorEl, 'inputEx-field-color');
	YAHOO.util.Dom.setStyle(this.colorEl, 'background-color', this.el.value);

	// Render the popup
	this.renderPopUp();

	// Elements are bound to divEl
	this.divEl.appendChild(this.el);
	this.divEl.appendChild(this.colorEl);
};

// This create a popup and add an colorGrid
YAHOO.inputEx.ColorField.prototype.renderPopUp = function() {
	
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
	this.colorPopUp = document.createElement('div');
   YAHOO.util.Dom.setStyle(this.colorPopUp, "width", width+'px');
   YAHOO.util.Dom.setStyle(this.colorPopUp, "display", 'none');
	YAHOO.util.Dom.addClass(this.colorPopUp, 'inputEx-color-popup');
	
	// create the title
	if (this.displayTitle) {
      var div = document.createElement('div');
      div.innerHTML = YAHOO.inputEx.messages.selectColor;
      this.colorPopUp.appendChild( div );
   }

   var body = document.createElement('div');
   body.appendChild( this.renderColorGrid() );
   this.colorPopUp.appendChild(body);
   
   this.divEl.appendChild(this.colorPopUp);
};

/**
 * Add listeners for click and blur events
 *
 * @method           initEvents
 * @memberOf         YAHOO.inputEx.ColorField
 */
YAHOO.inputEx.ColorField.prototype.initEvents = function() {
	YAHOO.util.Event.addListener(this.colorEl, "click", this.toggleColorPopUp, this, true);
	YAHOO.util.Event.addListener(this.colorEl, "blur", this.closeColorPopUp, this, true);
};

YAHOO.inputEx.ColorField.prototype.toggleColorPopUp = function() {
	if( this.visible ) {	this.colorPopUp.style.display = 'none'; /*this.colorPopUp.hide(); */}
	else { this.colorPopUp.style.display = 'block'; /*this.colorPopUp.show(); */}
	this.visible = !this.visible;
};

YAHOO.inputEx.ColorField.prototype.close = function() {
   this.closeColorPopUp();
};

YAHOO.inputEx.ColorField.prototype.closeColorPopUp = function() {
	this.colorPopUp.style.display = 'none'; /*this.colorPopUp.hide(); */
	this.visible = false;
};

/**
 * This creates a color grid
 */ 
YAHOO.inputEx.ColorField.prototype.renderColorGrid = function() {
	
	var table = document.createElement('TABLE');
	var tbody = document.createElement('TBODY');
	var square, line, spacer;
	for(var i = 0; i<this.squaresPerColumn; i++) {
		line = document.createElement('TR');
		for(var j = 0; j<this.squaresPerLine; j++) {
			// spacer cells
			spacer = document.createElement('TD');
			YAHOO.util.Dom.setStyle(spacer, 'background-color', '#fff');
			YAHOO.util.Dom.setStyle(spacer, 'line-height', '10px');
			YAHOO.util.Dom.setStyle(spacer, 'cursor', 'default');
			spacer.innerHTML = '&nbsp;';
			line.appendChild(spacer);

			// fill remaining space with empty and inactive squares
		    if (i===(this.squaresPerColumn-1) && j>=this.squaresOnLastLine ) {
				square = document.createElement('TD');
				YAHOO.util.Dom.setStyle(square, 'background-color', '#fff');
				YAHOO.util.Dom.setStyle(square, 'line-height', '10px');
				YAHOO.util.Dom.setStyle(square, 'cursor', 'default');
				square.innerHTML = '&nbsp;&nbsp;&nbsp;';
				line.appendChild(square);
			// create active squares
			} else {
				square = document.createElement('TD');
				YAHOO.util.Dom.setStyle(square, 'background-color', '#'+this.colors[i*this.squaresPerLine+j]);
				YAHOO.util.Dom.setStyle(square, 'line-height', '10px');
				YAHOO.util.Dom.setStyle(square, 'cursor', 'pointer');
				square.innerHTML = '&nbsp;&nbsp;&nbsp;';
				YAHOO.util.Event.addListener(square, "click", this.onColorClick, this, true );
				line.appendChild(square);
			}
		}
		tbody.appendChild(line);
		
		// spacer line
		spacer = document.createElement('TR');
		YAHOO.util.Dom.setStyle(spacer, 'height', '8px');
		tbody.appendChild(spacer);
	}
	table.appendChild(tbody);

	return table;
};

YAHOO.inputEx.ColorField.prototype.onColorClick = function(e) {
	var square = e.target;
	var couleur = YAHOO.util.Dom.getStyle(square,'background-color'); 
	YAHOO.util.Dom.setStyle(this.colorEl,'background-color',couleur);
	
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
	this.colorPopUp.style.display = 'none'; /*this.colorPopUp.hide(); */
};

YAHOO.inputEx.ColorField.prototype.setDefaultColors = function(index) {
	var selections = [];
	// Interventions
	selections[0] = ["FFEA99","FFFF66","FFCC99","FFCAB2","FF99AD","FFD6FF","FF6666","E8EEF7","ADC2FF","ADADFF","CCFFFF","D6EAAD","B5EDBC","CCFF99"]; //["FF0000","FF2222","FF3333","FF4444","FF5555","FF6666","FF7777","FF8888","FF9999","FFAAAA"];
	//Evenements
	selections[1] = ["55AAFF","FFAAFF","FF7FAA","FF0202","FFD42A","F9F93B","DF8181","FEE3E2","D47FFF","2AD4FF","2AFFFF","AAFFD4"];
	// Extjs colorPalette
	selections[2] = ["000000","993300","333300","003300","003366","000080","333399","333333","800000","FF6600","808000","008000","008080","0000FF","666699","808080","FF0000","FF9900","99CC00","339966","33CCCC","3366FF","800080","969696","FF00FF","FFCC00","FFFF00","00FF00","00FFFF","00CCFF","993366","C0C0C0","FF99CC","FFCC99","FFFF99","CCFFCC","CCFFFF","99CCFF","CC99FF","F0F0F0"];
	
	return selections[index-1];
};

YAHOO.inputEx.ColorField.prototype.setValue = function(val) {
   this.el.value = val;
   YAHOO.util.Dom.setStyle(this.colorEl, 'background-color', this.el.value);
};

   