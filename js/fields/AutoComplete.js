/**
 * @class An autocomplete module
 * @constructor
 * @extends inputEx.StringField
 */
 
inputEx.AutoComplete = function(options) {
   inputEx.AutoComplete.superclass.constructor.call(this, options);
};

YAHOO.extend(inputEx.AutoComplete, inputEx.StringField);

/**
 * Adds autocomplete options
 */
inputEx.AutoComplete.prototype.setOptions = function() {
   
   this.options.className = this.options.className || 'inputEx-Field inputEx-AutoComplete';
   
   inputEx.AutoComplete.superclass.setOptions.call(this);
   
   this.options.highlightClass = 'inputEx-AutoComplete-ItemHovered';
   this.options.timerDelay = this.options.timerDelay || 300;
   this.options.query = this.options.query || null;
   this.options.queryMinLength = this.options.queryMinLength || 2;
   this.options.displayEl = this.options.displayEl || function(val) { return inputEx.cn('div', null, null, val); };
};

/**
 * Render the hidden list element
 */
inputEx.AutoComplete.prototype.renderComponent = function() {
   
   inputEx.AutoComplete.superclass.renderComponent.call(this);
   
   // Render the list :
   this.listEl = inputEx.cn('div', {className: 'inputEx-AutoComplete-List'}, {display: 'none'});
   this.divEl.appendChild(this.listEl);
};

/**
 * Register some additional events
 */
inputEx.AutoComplete.prototype.initEvents = function() {
   inputEx.AutoComplete.superclass.initEvents.call(this);
   
   YAHOO.util.Event.addListener(this.listEl, "click", this.validateItem, this, true);
   YAHOO.util.Event.addListener(this.listEl, "mouseover", this.onListMouseOver, this, true);
   
   YAHOO.util.Event.addListener(this.el, "keydown", this.onKeyDown, this, true);
};


/**
 * Listen for up/down keys
 */
inputEx.AutoComplete.prototype.onKeyDown = function(e) {
   
   // up/down keys
   if( e.keyCode == 40 || e.keyCode == 38) {
   
      var pos = -1;
      for(var i = 0 ; i < this.listEl.childNodes.length ; i++) {
         if(this.listEl.childNodes[i]==this.highlightedItem) {
            pos = i;
            break;
         }
      }
   
      var lastPos = this.listEl.childNodes.length-1;
      var indexItemToHighlight = (e.keyCode == 40) ? (pos < lastPos ? pos+1 : 0) : (pos != 0 ? pos-1 : lastPos);
      var liItem = this.listEl.childNodes[indexItemToHighlight];
            
      if(liItem) {
         this.highlightItem(liItem);
         YAHOO.util.Event.stopEvent(e);
      }
   }
   
};


/**
 * Start the typing timer on Input
 */
inputEx.AutoComplete.prototype.onInput = function(e) { 
   inputEx.AutoComplete.superclass.onInput.call(this, e);
   
   // Key enter
   if(e.keyCode == 13) {
      YAHOO.util.Event.stopEvent(e);
      this.validateItem();
	   return;
   }
   
   
   if( e.keyCode == 40 || e.keyCode == 38) {
      return;
   }
   
   
   /**
    * If this is a normal key, make the query
    */
   
   // trim whitespaces (remove spaces at beginning and end of string)
   var value = this.getValue().replace(/^\s+/g, '').replace(/\s+$/g, ''); 

   if(value.length >= this.options.queryMinLength ) {
      this.resetTimer();
   }
   else {
      this.stopTimer();
      this.hideList();
   }
   
};

/**
 * Validate the item
 */
inputEx.AutoComplete.prototype.validateItem = function() {
   
   var pos = -1;
   for(var i = 0 ; i < this.listEl.childNodes.length ; i++) {
      if(this.listEl.childNodes[i]==this.highlightedItem) {
         pos = i;
         break;
      }
   }
   if(pos == -1) { return; }
   
   this.setValue( this.options.displayAutocompleted.call(this, this.listValues[pos]) );
   this.hideList();
};

/**
 * Hide the list
 */
inputEx.AutoComplete.prototype.hideList = function() {
   this.listEl.style.display = 'none';
};

/**
 * Show the list
 */
inputEx.AutoComplete.prototype.showList = function() {
 this.listEl.style.display = '';
};

/**
 * Run the query function
 */
inputEx.AutoComplete.prototype.queryList = function(value) {
   this.options.query.call(this, value);
};

/**
 * Function to populate the list
 */
inputEx.AutoComplete.prototype.updateList = function(list) {
   
   this.listValues = list;
   
   this.listEl.innerHTML = "";
   
   // Call a rendering function:
   for(var i = 0 ; i < list.length ; i++) {
      var el = inputEx.cn('div', {className: 'inputEx-AutoComplete-Item'});
      el.appendChild( this.options.displayEl.call(this,list[i]) );
      this.listEl.appendChild(el);
   }
   
   // Make the list visible
   this.showList();
};

/**
 * The timer is used to wait a little before sending the request, so that we don't send too much requests.
 */
inputEx.AutoComplete.prototype.resetTimer = function() {
   if( this.timer ) {
      clearTimeout(this.timer);
   }
   var that = this;
   this.timer = setTimeout(function() { that.timerEnd(); }, this.options.timerDelay);
};


inputEx.AutoComplete.prototype.stopTimer = function() {
   if( this.timer ) {
      clearTimeout(this.timer);
   }
};

/**
 * Send the request when the timer ends.
 */
inputEx.AutoComplete.prototype.timerEnd = function() {
   var value = this.getValue().replace(/^\s+/g, '').replace(/\s+$/g, ''); 
	
   this.queryList(value);
};



inputEx.AutoComplete.prototype.onBlur = function(e) {
   inputEx.AutoComplete.superclass.onBlur.call(this, e);
   //console.log("blur",e);
   
   // TODO: we must do something like this
   // but it is fired before the click event !
   //this.hideList();
};


/**
 * Set the highlighted item
 */
inputEx.AutoComplete.prototype.highlightItem = function(liItem) {
   this.toggleHighlightItem(this.highlightedItem, false);
   this.toggleHighlightItem(liItem, true);
   this.highlightedItem = liItem;
};


/**
 * Hightlight or unhighlight an item from the list
 */
inputEx.AutoComplete.prototype.toggleHighlightItem = function(liItem, highlight) {
   if(highlight) {
     YAHOO.util.Dom.addClass(liItem, this.options.highlightClass);
   }
   else {
     YAHOO.util.Dom.removeClass(liItem, this.options.highlightClass);
   }
};

/**
 * Highlight the overed item
 */ 
inputEx.AutoComplete.prototype.onListMouseOver = function(e) {
   var target = YAHOO.util.Event.getTarget(e);
   if( YAHOO.util.Dom.hasClass(target, 'inputEx-AutoComplete-Item') ) {
      this.highlightItem(target);
   }
};
