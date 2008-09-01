/**
 * @class 
 * @inherits YAHOO.inputEx.Group
 */
YAHOO.inputEx.GroupBuilder = function(options) {
   options.fields = YAHOO.inputEx.Group.groupOptions;
   YAHOO.inputEx.GroupBuilder.superclass.constructor.call(this, options);
};

YAHOO.extend(YAHOO.inputEx.GroupBuilder, YAHOO.inputEx.Group, {
   
   initEvents: function() {
      // Update the preview event
      this.updatedEvt.subscribe(this.rebuildPreview, this, true);
   },
   
   rebuildPreview: function() {      
      var value = this.getValue();

      this._group = new YAHOO.inputEx.Group(value);
      
      var groupContainer = YAHOO.util.Dom.get('groupContainer');
      groupContainer.innerHTML = "";
      groupContainer.appendChild(this._group.getEl());
      
      var codeContainer = YAHOO.util.Dom.get('codeGenerator');
      codeContainer.innerHTML = value.toPrettyJSONString(true);
   },
   
   setValue: function(value) {
      YAHOO.inputEx.GroupBuilder.superclass.setValue.call(this, value);
      this.rebuildPreview();
   }
   
});


YAHOO.util.Event.addListener(window, 'load', function() {
   new YAHOO.inputEx.GroupBuilder({parentEl: 'container', value: {
   	"fields" : [
   		{
   			"type" : "string",
   			"label" : "Nom",
   			"inputParams" : {
   				"name" : "name",
   				"required" : true,
   				"value" : "",
   				"size" : 20
   			}
   		},
   		{
   			"type" : "string",
   			"label" : "Prénom",
   			"inputParams" : {
   				"name" : "firstname",
   				"required" : true,
   				"value" : "",
   				"size" : 20
   			}
   		},
   		{
   			"type" : "email",
   			"label" : "Email",
   			"inputParams" : {
   				"name" : "",
   				"value" : "",
   				"required" : false,
   				"size" : 20
   			}
   		},
   		{
   			"type" : "list",
   			"label" : "Colors",
   			"inputParams" : {
   				"elementType" : {
   					"type" : "color",
   					"inputParams" : {
   						"name" : ""
   					}
   				},
   				"listLabel" : "",
   				"name" : "",
   				"value" : [

   				],
   				"required" : false,
   				"sortable" : false
   			}
   		}
   	],
   	"collapsible" : true,
   	"legend" : "User"
   }
   
   });
});

YAHOO.inputEx.spacerUrl = "../images/space.gif";