/**
 * InputEx demo page
 */
var demo = {
   
   init: function() {
      YAHOO.util.Event.addListener('componentsUl', 'click', this.onClickComponent, this, true);
      this.showExamples(this.examplePages["Field"]);
   },
   
   onClickComponent: function(e, args) {
      var li = YAHOO.util.Event.getTarget(e);
      if(li.tagName != "LI") return;
      var className = li.innerHTML.replace(' ','');
      if(!this.examplePages[className]) {
         alert("no example for '"+className+"'");
         return;
      }
      this.showExamples(this.examplePages[className]);
   }, 
   
   showExamples: function(exampleList) {
      
      var page = inputEx.cn('div');
      
      for(var i = 0 ; i < exampleList.length ; i++) {
         var example = exampleList[i];
         exampleDiv = inputEx.cn('div', {className: "exampleDiv"});
         
         exampleDiv.appendChild( inputEx.cn('p', {className: "exampleTitle"}, null, example.title) );
         exampleDiv.appendChild( inputEx.cn('p', {className: "exampleDescription"}, null, example.description) );
         exampleDiv.appendChild( inputEx.cn('p', {className: "exampleCode"}, null, example.code.replace(/\n/g,'<br/>')) );
         
         exampleDiv.appendChild( inputEx.cn('p', null, null, "Result :") );
         
         try {
            eval(example.code);
         }
         catch(ex) {
            alert(ex.message);
         }
         
         page.appendChild(exampleDiv);
      }
      
      var exampleContainer = YAHOO.util.Dom.get('exampleContainer');
      exampleContainer.innerHTML = "";
      exampleContainer.appendChild(page);
   },
   
   examplePages: {
      /**
       * inputEx.Field
       */
      "Field": [ 
      {
         title: "Basic Field creation",
         description: "Use the following code to create a basic inputEx field.",
         code: "var field = new inputEx.Field();\n exampleDiv.appendChild( field.getEl() );"
      },
      
      {
         title: "With a default value",
         description: "You can set a default value by specifying the 'value' property in the options object:",
         code: "var field = new inputEx.Field({value: 'my default value'});\n exampleDiv.appendChild( field.getEl() );"
      },
      
      {
         title: "Changing the size",
         description: "You can set the size of the input:",
         code: "var field = new inputEx.Field({size: 40, value: 'size is set to 40 (default is 20)'});\n exampleDiv.appendChild( field.getEl() );"
      },
      
      {
         title: "Tooltip icons",
         description: "InputEx can add a icon next to each field that will represent the state of the field. A tooltip is added on this icon with a message.",
         code: "var field = new inputEx.Field({value: 'test', tooltipIcon: true});\n exampleDiv.appendChild( field.getEl() );"
      },
      
      {
         title: "Required",
         description: "If the 'required' property is set, the 'validate' method will return false if the field is empty. In a form, the 'validate' method will be called on each field and won't continue if at least one field doesn't validate.",
         code: "var field = new inputEx.Field({required: true, tooltipIcon: true});\n exampleDiv.appendChild( field.getEl() );"
      },
      
      {
         title: "Numbers only",
         description: "If the 'numbersOnly' property is set, the field will only accept numbers !",
         code: "var field = new inputEx.Field({numbersOnly: true});\n exampleDiv.appendChild( field.getEl() );"
      },
      
      {
         title: "Regular Expression",
         description: "The basic Field class can use regular expressions to validate the field content. Here is an example with this wonderful email regular expression (note that there is an Email Field class).",
         code: "var field = new inputEx.Field({tooltipIcon: true,regexp: inputEx.regexps.email, value: 'wrong@email'});\n exampleDiv.appendChild( field.getEl() );"
      },
      
      {
         title: "Enabling/Disabling inputs",
         description: "You can call the methods 'disable' or 'enable' to set the state of the field.",
         code: "var field = new inputEx.Field({value: 'This field is disabled'});\nfield.disable();\n exampleDiv.appendChild( field.getEl() );"
      }
      
      
      ],
      
      /**
       * inputEx.CheckBox
       */
      "CheckBox": [
      {
         title: "Basic CheckBox Field",
         description: "Basic use of the CheckBox field",
         code: "var field = new inputEx.CheckBox();\nexampleDiv.appendChild( field.getEl() );"
      },
      {
         title: "CheckBox labels",
         description: "You can add a label",
         code: "var field = new inputEx.CheckBox({label: 'Check me !'});\n exampleDiv.appendChild( field.getEl() );"
      },
      {
         title: "Default returned values",
         description: "In its simplest form, the CheckBox returns <i>true</i> if checked, <i>false</i> otherwise.",
         code: "var field1 = new inputEx.CheckBox({label: 'I return true/false'});\nexampleDiv.appendChild( field1.getEl() );\nvar button = inputEx.cn('button', null, null, 'getValue()');\nexampleDiv.appendChild(button); YAHOO.util.Event.addListener(button, 'click', function() { alert(field1.getValue()); });"
      },
      {
         title: "Changing the returned values",
         description: "You can return different values if needed.",
         code: "var field2 = new inputEx.CheckBox({sentValues: ['Yes', 'No'], label: 'Do you agree ?'});\nexampleDiv.appendChild( field2.getEl() );\nvar button = inputEx.cn('button', null, null, 'getValue()');\nexampleDiv.appendChild(button); YAHOO.util.Event.addListener(button, 'click', function() { alert(field2.getValue()); });"
      }
      ],
      
      /**
       * inputEx.ColorField
       */
      "ColorField": [
      {
         title: "Basic Color Field",
         description: "Basic use of the ColorField",
         code: "var field = new inputEx.ColorField();\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.EmailField
       */
      "EmailField": [
      {
         title: "Basic Email Field",
         description: "Basic use of the EmailField",
         code: "var field = new inputEx.EmailField({tooltipIcon: true, required: true});\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.IPv4Field
       */
      "IPv4Field": [
      {
         title: "Basic IPv4 Field",
         description: "Basic use of the IPv4Field",
         code: "var field = new inputEx.IPv4Field({tooltipIcon: true, required: true});\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.PasswordField
       */
      "PasswordField": [
      {
         title: "Basic PasswordField Field",
         description: "Basic use of the PasswordField",
         code: "var field = new inputEx.PasswordField();\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.Textarea
       */
      "Textarea": [
      {
         title: "Basic Textarea Field",
         description: "Basic use of the Textarea field",
         code: "var field = new inputEx.Textarea({value: 'This is a test !\\nTextareas are multiline'});\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.UrlField
       */
       "UrlField": [
       {
          title: "Basic Url Field",
          description: "Basic use of the Url field",
          code: "var field = new inputEx.UrlField({name: 'websiteUrl'});\nexampleDiv.appendChild( field.getEl() ); window.machin= field;"
       }
       ],
       
      /**
       * inputEx.ListField
       */
      "ListField": [
      {
         title: "Basic List Field",
         description: "Basic use of the List field",
         code: "var field = new inputEx.ListField({name: 'websiteUrl', listLabel: 'Websites',elementType: inputEx.UrlField, elementOptions: {},value: ['http://www.neyric.com', 'http://www.ajaxian.com', 'http://www.google.com', 'http://www.yahoo.com']});\nexampleDiv.appendChild( field.getEl() ); var button = inputEx.cn('button', null, null, 'getValue()');\nexampleDiv.appendChild(button); YAHOO.util.Event.addListener(button, 'click', function() { console.log(field.getValue()); });  var button2 = inputEx.cn('button', null, null, 'setValue()');\nexampleDiv.appendChild(button2); YAHOO.util.Event.addListener(button2, 'click', function() { field.setValue(['http://www.sncf.com','http://www.clicrdv.com','http://www.neyric.com','http://javascript.neyric.com/wireit']); });"
      }
      ],
      
      /**
       * inputEx.SelectField
       */
      "SelectField": [
      {
         title: "Basic Select Field",
         description: "Basic use of the Select field",
         code: "var field = new inputEx.SelectField({name: 'country', selectValues: ['United States of America','France']});\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.RTEField
       */
      "RTEField": [
      {
         title: "Basic Rich Text Editor Field",
         description: "Basic use of the RTEField field",
         code: "var field = new inputEx.RTEField({name: 'rteField'});\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.SelectField
       */
      "TypeField": [
      {
         title: "Basic Type Field",
         description: "Basic use of the Type field",
         code: " field = new inputEx.TypeField({name: 'test'});\nexampleDiv.appendChild( field.getEl() );"
      }
      ],
      
      /**
       * inputEx.Group
       */
      "Group": [
      {
         title: "Basic Group",
         description: "Group",
         code: "var group = new inputEx.Group( [ {label: 'Title', type: 'select', optional: true, inputParams: {name: 'title', selectValues: ['Mr','Mrs','Mme'] } }, {label: 'Firstname', inputParams: {name: 'firstname', required: true, value:'Jacques' } }, {label: 'Lastname', inputParams: {name: 'lastname', value:'Dupont' } }, {label: 'Email', type:'email', optional: true}, {label: 'Website', type:'url', optional: true} ]);\nexampleDiv.appendChild( group.getEl() ); "
      }
      ]
   }

};


YAHOO.util.Event.addListener(window, "load", demo.init, demo, true);