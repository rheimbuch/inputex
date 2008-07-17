(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang, Event = YAHOO.util.Event, Dom = YAHOO.util.Dom;

/**
 * @class An autocomplete module
 * @constructor
 * @extends inputEx.StringField
 * @param {Object} options Added options for Autocompleter
 * <ul>
 *	  <li>highlightClass: the CSS className added to highlight selected item</li>
 *	  <li>timerDelay: number of milliseconds to wait before sending the request (default is 300)</li>
 *	  <li>query: function called for the querying</li>
 *   <li>visuItem: the visualization object to display each item</li>
 *   <li>displayAutocompleted: method taht should return the string set to the field when an item is selected</li>
 *   <li>queryMinLength: minimum number of letters to type before sending the query (default is 2)</li>
 * </ul>
 */
inputEx.AutoComplete = function(options) {
   inputEx.AutoComplete.superclass.constructor.call(this, options);
};

lang.extend(inputEx.AutoComplete, inputEx.StringField, 
/**
 * @scope inputEx.AutoComplete.prototype   
 */   
{

   /**
    * Adds autocomplete options
    */
   setOptions: function() {
   
      this.options.className = this.options.className || 'inputEx-Field inputEx-AutoComplete';
   
      inputEx.AutoComplete.superclass.setOptions.call(this);
   
      this.options.highlightClass = 'inputEx-AutoComplete-ItemHovered';
      this.options.timerDelay = this.options.timerDelay || 300;
      this.options.query = this.options.query || null;
      this.options.queryMinLength = this.options.queryMinLength || 2;
   },

   /**
    * Render the hidden list element
    */
   renderComponent: function() {
   
      inputEx.AutoComplete.superclass.renderComponent.call(this);
   
      // Render the list :
      this.listEl = inputEx.cn('div', {className: 'inputEx-AutoComplete-List'}, {display: 'none'});
      this.divEl.appendChild(this.listEl);
   },

   /**
    * Register some additional events
    */
   initEvents: function() {
      inputEx.AutoComplete.superclass.initEvents.call(this);
   
      Event.addListener(this.listEl, "click", this.validateItem, this, true);
      Event.addListener(this.listEl, "mouseover", this.onListMouseOver, this, true);
   
      Event.addListener(this.el, "keydown", this.onKeyDown, this, true);
      
      Event.addListener(this.el, "input", this.onInput, this, true);
   },

   /**
    * Listen for up/down keys
    * @param {Event} e THe original keydown event
    */
   onKeyDown: function(e) {
   
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
            Event.stopEvent(e);
         }
      }   
      
      // Key enter
      if(e.keyCode == 13) {
         this.validateItem();
         this.fireUpdatedEvt();
         Event.stopEvent(e);
	      return;
      }
   },


   /**
    * Start the typing timer on Input
    * @param {Event} e The original input event
    */
   onInput: function(e) { 
   
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
    },

    /**
     * Called when the user clicked on an item or pressed the enter key
     */
    validateItem: function() {
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
    },

   /**
    * Hide the list
    */
   hideList: function() {
      this.listEl.style.display = 'none';
   },

   /**
    * Show the list
    */
   showList: function() {
      this.listEl.style.display = '';
   },

   /**
    * Run the query function
    */
   queryList: function(value) {
      this.options.query.call(this, value);
   },

   /**
    * Function to populate the list
    */
   updateList: function(list) {
   
      this.listValues = list;
   
      this.listEl.innerHTML = "";
   
      // Call a rendering function:
      for(var i = 0 ; i < list.length ; i++) {
         var el = inputEx.cn('div', {className: 'inputEx-AutoComplete-Item'});
      
         //el.appendChild( this.options.displayEl.call(this,list[i]) );
         inputEx.renderVisu(this.options.visuItem, list[i], el);
      
         this.listEl.appendChild(el);
      }
   
      // Make the list visible
      this.showList();
   },

   /**
    * The timer is used to wait a little before sending the request, so that we don't send too much requests.
    */
   resetTimer: function() {
      if( this.timer ) {
         clearTimeout(this.timer);
      }
      var that = this;
      this.timer = setTimeout(function() { that.timerEnd(); }, this.options.timerDelay);
   },

   /**
    * Stop the timer
    */
   stopTimer: function() {
      if( this.timer ) {
         clearTimeout(this.timer);
      }
   },

   /**
    * Send the request when the timer ends.
    */
   timerEnd: function() {
      var value = this.getValue().replace(/^\s+/g, '').replace(/\s+$/g, ''); 
      this.queryList(value);
   },

   /**
    * Set the highlighted item
    * @param {HTMLElement} liItem The LI node to highlight
    */
   highlightItem: function(liItem) {
      this.toggleHighlightItem(this.highlightedItem, false);
      this.toggleHighlightItem(liItem, true);
      this.highlightedItem = liItem;
   },


   /**
    * Hightlight or unhighlight an item from the list
    * @param {HTMLElement} liItem The LI node to highlight
    * @param {Boolean} highlight The highlight state to set
    */
   toggleHighlightItem: function(liItem, highlight) {
      if(highlight) {
         Dom.addClass(liItem, this.options.highlightClass);
      }
      else {
         Dom.removeClass(liItem, this.options.highlightClass);
      }
   },

   /**
    * Highlight the overed item
    * @param {Event} e The original mouseover event
    */ 
   onListMouseOver: function(e) {
      var target = Event.getTarget(e);
      if( Dom.hasClass(target, 'inputEx-AutoComplete-Item') ) {
         this.highlightItem(target);
      }
   }

});

})();