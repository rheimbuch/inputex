/**
 * Adds an url regexp, and display the favicon at this url
 *
 * @class inputEx.UrlField
 * @extends inputEx.Field
 */
inputEx.UrlField = function(options) {
   inputEx.UrlField.superclass.constructor.call(this,options);
};

YAHOO.lang.extend(inputEx.UrlField, inputEx.Field, {
   
   /**
    * Adds the invalid Url message
    */
   setOptions: function() {
      inputEx.UrlField.superclass.setOptions.call(this);
      this.options.className = "inputEx-Field inputEx-UrlField";
      this.options.messages.invalid = inputEx.messages.invalidUrl;
   },
   
   /**
    * Url are lower case
    */
   getValue: function() {
      return this.el.value.toLowerCase();
   },
   
   setValue: function(value) {
   	this.el.value = value;
   	this.validate();
   },
   
   /**
    * Adds a img tag before the field to display the favicon
    */
   render: function() {
      inputEx.UrlField.superclass.render.call(this);
      this.el.size = 27;

      // Create the favicon image tag
      this.favicon = inputEx.cn('img');
      this.divEl.insertBefore(this.favicon,this.el);
   },
   
   /**
    * Validate the field with an url regexp and set the favicon url
    */
   validate: function() {
      var url = this.getValue().match(inputEx.regexps.url);   
      
      // Hide the favicon
      inputEx.sn(this.favicon, null, {visibility: 'hidden'});
      
      // Change the src
      //if(url) { this.favicon.src = url[0]+"/favicon.ico"; }
      this.favicon.src = url ? (url[0]+"/favicon.ico") : inputEx.spacerUrl;
      
      // Set the timer to launch displayFavicon in 1s
      if(this.timer) { clearTimeout(this.timer); }
   	var that = this;
   	this.timer = setTimeout(function(){that.displayFavicon();}, 1000);
      	
      return !!url;
   },
   
   // Display the favicon if the icon was found (use of the naturalWidth property)
   displayFavicon: function() {
      inputEx.sn(this.favicon, null, {visibility: (this.favicon.naturalWidth!=0) ? 'visible' : 'hidden'});
   }
   
});


inputEx.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";


/**
 * Register this class as "url" type
 */
inputEx.registerType("url", inputEx.UrlField);
