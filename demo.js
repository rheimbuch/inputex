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
            console.log(example.code);
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
         code: "new inputEx.Field({parentEl: exampleDiv});"
      },
      
      {
         title: "With a default value",
         description: "You can set a default value by specifying the 'value' property in the options object:",
         code: "new inputEx.Field({value: 'my default value', parentEl: exampleDiv});"
      },
      
      {
         title: "Changing the size",
         description: "You can set the size of the input:",
         code: "new inputEx.Field({size: 40, value: 'size is set to 40 (default is 20)', parentEl: exampleDiv});"
      },
      
      {
         title: "Tooltip icons",
         description: "InputEx can add a icon next to each field that will represent the state of the field. A tooltip is added on this icon with a message.",
         code: "new inputEx.Field({value: 'test', tooltipIcon: true, parentEl: exampleDiv});"
      },
      
      {
         title: "Required",
         description: "If the 'required' property is set, the 'validate' method will return false if the field is empty. In a form, the 'validate' method will be called on each field and won't continue if at least one field doesn't validate.",
         code: "new inputEx.Field({required: true, tooltipIcon: true, parentEl: exampleDiv});"
      },
      
      {
         title: "Numbers only",
         description: "If the 'numbersOnly' property is set, the field will only accept numbers !",
         code: "new inputEx.Field({numbersOnly: true, parentEl: exampleDiv});"
      },
      
      {
         title: "Regular Expression",
         description: "The basic Field class can use regular expressions to validate the field content. Here is an example with this wonderful email regular expression (note that there is an Email Field class).",
         code: "new inputEx.Field({tooltipIcon: true,regexp: inputEx.regexps.email, value: 'wrong@email', parentEl: exampleDiv});"
      },
      
      {
         title: "Enabling/Disabling inputs",
         description: "You can call the methods 'disable' or 'enable' to set the state of the field.",
         code: "var field = new inputEx.Field({value: 'This field is disabled', parentEl: exampleDiv});\nfield.disable();"
      }
      
      
      ],
      
      /**
       * inputEx.CheckBox
       */
      "CheckBox": [
      {
         title: "Basic CheckBox Field",
         description: "Basic use of the CheckBox field",
         code: "new inputEx.CheckBox({parentEl: exampleDiv});"
      },
      {
         title: "CheckBox labels",
         description: "You can add a label",
         code: "new inputEx.CheckBox({label: 'Check me !', parentEl: exampleDiv});"
      },
      {
         title: "Default returned values",
         description: "In its simplest form, the CheckBox returns <i>true</i> if checked, <i>false</i> otherwise.",
         code: "var field1 = new inputEx.CheckBox({label: 'I return true/false', parentEl: exampleDiv});\nvar button = inputEx.cn('button', null, null, 'getValue()');\nexampleDiv.appendChild(button); YAHOO.util.Event.addListener(button, 'click', function() { alert(field1.getValue()); });"
      },
      {
         title: "Changing the returned values",
         description: "You can return different values if needed.",
         code: "var field2 = new inputEx.CheckBox({sentValues: ['Yes', 'No'], label: 'Do you agree ?', parentEl: exampleDiv});\nvar button = inputEx.cn('button', null, null, 'getValue()');\nexampleDiv.appendChild(button); YAHOO.util.Event.addListener(button, 'click', function() { alert(field2.getValue()); });"
      }
      ],
      
      /**
       * inputEx.ColorField
       */
      "ColorField": [
      {
         title: "Basic Color Field",
         description: "Basic use of the ColorField",
         code: "new inputEx.ColorField({parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.EmailField
       */
      "EmailField": [
      {
         title: "Basic Email Field",
         description: "Basic use of the EmailField",
         code: "new inputEx.EmailField({tooltipIcon: true, required: true, parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.IPv4Field
       */
      "IPv4Field": [
      {
         title: "Basic IPv4 Field",
         description: "Basic use of the IPv4Field",
         code: "new inputEx.IPv4Field({tooltipIcon: true, required: true, parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.PasswordField
       */
      "PasswordField": [
      {
         title: "Basic PasswordField Field",
         description: "Basic use of the PasswordField",
         code: "new inputEx.PasswordField({tooltipIcon: true, required: true, parentEl: exampleDiv});"
      },
      {
         title: "Password and confirmation",
         description: "We always want a password field with a confirmation",
         code: "var pass1 = new inputEx.PasswordField({tooltipIcon: true, required: true, parentEl: exampleDiv});\nvar pass2 = new inputEx.PasswordField({tooltipIcon: true, required: true, parentEl: exampleDiv});\npass2.setConfirmationField(pass1);"
      }
      ],
      
      /**
       * inputEx.Textarea
       */
      "Textarea": [
      {
         title: "Basic Textarea Field",
         description: "Basic use of the Textarea field",
         code: "new inputEx.Textarea({value: 'This is a test !\\nTextareas are multiline', parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.UrlField
       */
       "UrlField": [
       {
          title: "Basic Url Field",
          description: "Basic use of the Url field",
          code: "new inputEx.UrlField({name: 'websiteUrl', parentEl: exampleDiv});"
       }
       ],
       
      /**
       * inputEx.ListField
       */
      "ListField": [
      {
         title: "Basic List Field",
         description: "Basic use of the List field",
         code: "var field = new inputEx.ListField({name: 'websiteUrl', listLabel: 'Websites',elementType: {type: 'url'},value: ['http://www.neyric.com', 'http://www.ajaxian.com', 'http://www.google.com', 'http://www.yahoo.com'], parentEl: exampleDiv});\nvar button = inputEx.cn('button', null, null, 'getValue()');\nexampleDiv.appendChild(button); YAHOO.util.Event.addListener(button, 'click', function() { console.log(field.getValue()); });  var button2 = inputEx.cn('button', null, null, 'setValue()');\nexampleDiv.appendChild(button2); YAHOO.util.Event.addListener(button2, 'click', function() { field.setValue(['http://www.sncf.com','http://www.clicrdv.com','http://www.neyric.com','http://javascript.neyric.com/wireit']); });"
      }
      ],
      
      /**
       * inputEx.SelectField
       */
      "SelectField": [
      {
         title: "Basic Select Field",
         description: "Basic use of the Select field",
         code: "new inputEx.SelectField({name: 'country', selectValues: ['United States of America','France'], parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.RTEField
       */
      "RTEField": [
      {
         title: "Basic Rich Text Editor Field",
         description: "Basic use of the RTEField field",
         code: "new inputEx.RTEField({name: 'rteField', parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.SelectField
       */
      "TypeField": [
      {
         title: "Basic Type Field",
         description: "Basic use of the Type field",
         code: "new inputEx.TypeField({name: 'test',createValueField: true, parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.Group
       */
      "Group": [
      {
         title: "Basic Group",
         description: "Group",
         code: "new inputEx.Group( [ {label: 'Title', type: 'select', optional: true, inputParams: {name: 'title', selectValues: ['Mr','Mrs','Mme'] } }, {label: 'Firstname', inputParams: {name: 'firstname', required: true, value:'Jacques' } }, {label: 'Lastname', inputParams: {name: 'lastname', value:'Dupont' } }, {label: 'Email', type:'email', optional: true, inputParams: {name: 'email'}}, {label: 'Website', type:'url', optional: true, inputParams: {name:'website'}} ], {parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.Form
       */
      "Form": [
      {
         title: "Basic Form",
         description: "How to use Form",
         code: "new inputEx.Form( [ {label: 'Title', type: 'select', optional: true, inputParams: {name: 'title', selectValues: ['Mr','Mrs','Mme'] } }, {label: 'Firstname', inputParams: {name: 'firstname', required: true, value:'Jacques' } }, {label: 'Lastname', inputParams: {name: 'lastname', value:'Dupont' } }, {label: 'Email', type:'email', optional: true, inputParams: {name: 'email'}}, {label: 'Website', type:'url', optional: true, inputParams: {name:'website'}} ], [{type: 'submit', value: 'Change'}], {parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.UneditableField
       */
       "UneditableField": [
       {
          title: "UneditableField with HTML string",
          description: "To format the value of the field with an html string, use the <i>formatValue</i> function (schould return a string):",
          code: "new inputEx.UneditableField({name: 'date', value: new Date(), formatValue: function(value) { return 'Now: <i>'+value+'</i>';} , parentEl: exampleDiv});"
       },
       {
           title: "UneditableField with DOM rendering",
           description: "To render the value of the field with a DOM element (to add a behaviour), use the <i>formatDom</i> function (schould return a dom element):",
           code: "new inputEx.UneditableField({name: 'date', value: 'http://neyric.com/images/diabolo.png', formatDom: function(value) { return inputEx.cn('img', {src: value}, {border: '2px solid black'});}, parentEl: exampleDiv });"
        }
      ],
      
      /**
       * inputEx.HiddenField
       */
      "HiddenField": [
      {
         title: "HiddenField",
         description: "The hidden field is by definition 'invisible', so there isn't a lot to see. However, it can be useful to keep an id :",
         code: "var group = new inputEx.Group( [ {label: '', type: 'hidden', inputParams: {name: 'id', value: 12 } }, {label: 'Firstname', inputParams: {name: 'firstname', required: true, value:'Jacques' } } ], {parentEl: exampleDiv});\nvar button=inputEx.cn('button',null,null, 'Get Value'); exampleDiv.appendChild(button); YAHOO.util.Event.addListener(button, 'click', function(){ alert(YAHOO.lang.JSON.stringify(group.getValue()) ); });"
      }
      ],
      
      /**
       * inputEx.UpperCaseField
       */
      "UpperCaseField": [ 
      {
         title: "Basic UpperCaseField creation",
         description: "Simple example on how to subclass a Field",
         code: "new inputEx.UpperCaseField({value: 'i was lowercase', parentEl: exampleDiv});"
      }
      ],
      
      /**
       * inputEx.DateField
       */
      "DateField": [ 
      {
         title: "DateField",
         description: "DateField",
         code: "new inputEx.DateField({value: new Date(), parentEl: exampleDiv});"
      }
      ]
   }

};


YAHOO.util.Event.addListener(window, "load", demo.init, demo, true);