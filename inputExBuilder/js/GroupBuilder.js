/**
 * @class 
 * @inherits inputEx.Group
 */
inputEx.GroupBuilder = function(options) {
   options.fields = inputEx.Group.groupOptions;
   inputEx.GroupBuilder.superclass.constructor.call(this, options);
   
   // Width of the list Div
   YAHOO.util.Dom.setStyle(this.tableNonOptional.rows[0].cells[1], 'width', '500px');
};


YAHOO.extend(inputEx.GroupBuilder, inputEx.Group, {
   
   initEvents: function() {
      // Update the preview event
      this.updatedEvt.subscribe(this.rebuildPreview, this, true);
   },
   
   rebuildPreview: function() {
      
      var value = this.getValue();
      
      //var formValue = null;
      //if(this._group) { formValue = this._group.getValue(); }
      this._group = new inputEx.Group(value);
      
      var groupContainer = YAHOO.util.Dom.get('groupContainer');
      groupContainer.innerHTML = "";
      groupContainer.appendChild(this._group.getEl());
      
      
      /*try {
         this._group.setValue(formValue);
      }
      catch(ex) {}*/
      
      var codeContainer = YAHOO.util.Dom.get('codeGenerator');
      codeContainer.innerHTML = value.toPrettyJSONString(true);
      
   }
   
});


YAHOO.util.Event.addListener(window, 'load', function() {
   new inputEx.GroupBuilder({parentEl: YAHOO.util.Dom.get('container')});
});


inputEx.spacerUrl = "../images/space.gif";