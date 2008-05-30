(function() {
   
   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;
/**
 * Contains the various visualization methods
 */
inputEx.visus = {
  
  /**
   * Use the trimpath-template engine
   * see http://code.google.com/p/trimpath/wiki/JavaScriptTemplates for syntax
   * options = {visuType: 'trimpath', template: "String template"}
   */
  trimpath: function(options, data) {
      if(!TrimPath) { alert('TrimPath is not on the page. Please load inputex/lib/trimpath-template.js'); return; }
      var tpl = TrimPath.parseTemplate(options.template);
     	var ret = tpl.process(data);
     	return ret;
  },
  
  /**
   * Use a rendering function
   * options = {visuType: 'func', func: function(data) { ...code here...} }
   */
  "func": function(options, data) {
     return options.func(data);
  },
  
  /**
   * Use YAHOO.lang.dump
   * options = {visuType: 'dump'}
   */
  dump: function(options, data) {
     return lang.dump(data);
  }
   
};

/**
 * render data with multiple facets
 * @static
 * @param {Object} config
 * @param {Object} data
 * @param {HTMLElement || String} parentEl optional Set the result as content of parentEl
 * @return {HTMLElement || String} the rendered string or domnode
 */
inputEx.renderVisu = function(visuOptions,data, parentEl) {
   
   var opts = visuOptions || {};
   var visuType = opts.visuType || 'dump';
   
   if( !inputEx.visus.hasOwnProperty(visuType) ) {
      throw new Error("inputEx: no visu for visuType: "+visuType);
   }
   
   var f = inputEx.visus[visuType];
   if( !lang.isFunction(f) ) {
      throw new Error("inputEx: no visu for visuType: "+visuType);
   }
   
   var v = null;
   try {
      v = f(opts,data);
   }
   catch(ex) {
      throw new Error("inputEx: error while running visu "+visuType+" : "+ex.message);
      return;
   }
   
   // Get the node
   var node = null;
   if(parentEl) {
      if(lang.isString(parentEl)) {
         node = YAHOO.util.Dom.get(parentEl);
      }
      else {
         node = parentEl;
      }
   }
   
   // Insert it
   if(node) {
      if(YAHOO.lang.isObject(v) && v.tagName ) {
         node.innerHTML = "";
         node.appendChild(v);
      }
      else {
         node.innerHTML = v;
      }
   }
   
   return v;
};

})();