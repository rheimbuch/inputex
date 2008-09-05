(function() {
   var inputEx = YAHOO.inputEx;

inputEx.Group.prototype.onChange = function(eventName, args) {
   
   // Check if interactions are defined
   var fieldValue = args[0];
   var fieldInstance = args[1];
   var index = inputEx.indexOf(fieldInstance, this.inputs);
   var fieldConfig = this.inputConfigs[index];
   if( !YAHOO.lang.isUndefined(fieldConfig.interactions) ) {
      // Let's run the interactions !
      var interactions = fieldConfig.interactions;
      for(var i = 0 ; i < interactions.length ; i++) {
         var interaction = interactions[i];
         if(interaction.valueTrigger === fieldValue) {
            this.runInteractions(interaction.actions);
         }
      }
   }
   
   //this.setClassFromState();
   this.fireUpdatedEvt();
};


inputEx.Group.prototype.runAction = function(action) {
   
   try {
      
   var field = this.getFieldByName(action.name);
   if( YAHOO.lang.isFunction(field[action.action]) ) {
      field[action.action].call(field);
   }
   else {
      console.log("action "+action.action+" is not a valid action for field "+action.name);
   }

   } catch(ex) {console.log(ex, action);}
};

inputEx.Group.prototype.runInteractions = function(actions) {
   for(var i = 0 ; i < actions.length ; i++) {
      this.runAction(actions[i]);
   }
};

})();