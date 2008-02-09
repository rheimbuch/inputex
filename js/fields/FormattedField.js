
/**
 * @class inputEx.FormattedField
 * Uses a format, inherits from inputEx.Field
 * This is used for numbers only.
 *
 * options:
 *		- format: format (zipcode: '#####', date: '##/##/####' )
 */
// Adds the numbers only option
inputEx.FormattedField = function(options) {
	inputEx.FormattedField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.FormattedField, inputEx.Field);

inputEx.FormattedField.prototype.validate = function() { 
	return !this.getFormattedValue().match('_');
};

// Alias for getValue() here, but to getValue will be overriden in Datefield (where formatted value like 10/04/2003 and value is a datetime like 2003-10-4 00:00:00).
inputEx.FormattedField.prototype.getFormattedValue = function() {
	return this.el.value;
};

inputEx.FormattedField.prototype.onInput = function(e) {
	
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

inputEx.FormattedField.prototype.initEvents = function() {
	inputEx.FormattedField.superclass.initEvents.call(this);
	YAHOO.util.Event.addListener(this.el, 'keydown', this.onKeyDown, this, true);
};

inputEx.FormattedField.prototype.onKeyDown = function(e) {
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

inputEx.FormattedField.prototype.onBlur = function(e) {
	inputEx.FormattedField.superclass.onBlur.call(this,e);

	if( this.getFormattedValue() == this.options.format.replace(/#/g,'_') ) {
		//this.setValue('');
      this.el.value = '';
	}

	this.setClassFromState();
};