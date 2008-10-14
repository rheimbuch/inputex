(function() {

   var lang = YAHOO.lang, Dom = YAHOO.util.Dom, Event = YAHOO.util.Event, inputEx = YAHOO.inputEx;

/**
 * @class Create an editable datatable
 * @extends inputEx.widget.DataTable
 * @constructor
 * @param {Object} options Options:
 * <ul>
 * </ul>
 */
inputEx.widget.DataTable = function(options) {
   
   this.options = options || {};
   this.options.id = this.options.id ||  Dom.generateId();
   this.options.parentEl = YAHOO.lang.isString(options.parentEl) ? Dom.get(options.parentEl) : options.parentEl;
   
   this.options.editing =  this.options.editing || 'formeditor';
   
   this.element = inputEx.cn('div', {id: this.options.id });
   
   this.columndefs = this.fieldsToColumndefs(this.options.fields);
   
   Event.onAvailable(this.options.id, this.renderDatatable, this, true);
   
   /**
	 * @event
	 * @param {Any} itemValue value of the removed item
	 * @desc YAHOO custom event fired when an item is removed
	 */
 	this.itemRemovedEvt = new YAHOO.util.CustomEvent('itemRemoved', this);
 	
   /**
	 * @event
	 * @param {Any} itemValue value of the added item
	 * @desc YAHOO custom event fired when an item is added
	 */
 	this.itemAddedEvt = new YAHOO.util.CustomEvent('itemAdded', this);
 	
   /**
	 * @event
	 * @param {Any} itemValue value of the modified item
	 * @desc YAHOO custom event fired when an item is modified
	 */
 	this.itemModifiedEvt = new YAHOO.util.CustomEvent('itemModified', this);
   
   // append it immediatly to the parent DOM element
   this.options.parentEl.appendChild(this.element);

};

inputEx.widget.DataTable.prototype = {
   
   renderDatatable: function() {
      
      this.datatable = new YAHOO.widget.DataTable(this.element,this.columndefs, this.options.datasource, this.options.datatableOpts);
      
      this.datatable.subscribe('cellClickEvent', this.onCellClick, this, true);
      
      // FORM EDITION
      if(this.options.editing == "formeditor") {

         // Subscribe to events for row selection 
         this.datatable.subscribe("rowMouseoverEvent", this.datatable.onEventHighlightRow); 
         this.datatable.subscribe("rowMouseoutEvent", this.datatable.onEventUnhighlightRow); 
         this.datatable.subscribe("rowClickEvent", this.datatable.onEventSelectRow); 
      
         // Listener for row selection
         this.datatable.subscribe("rowSelectEvent", this.onEventSelectRow, this, true); 
      
      
         // Build the form
         var that = this;
         this.subForm = new inputEx.Form({
            parentEl: this.options.parentEl, 
            fields: this.options.fields,
            legend: "Row edition",
            buttons: [ {type: 'submit', onClick: function(e) {  Event.stopEvent(e); that.onSaveForm(); }, value: 'Save' } ]
         });
      
         // Programmatically select the first row 
         this.datatable.selectRow(this.datatable.getTrEl(0));
      
         // Programmatically bring focus to the instance so arrow selection works immediately 
         this.datatable.focus(); 
      
         // Positionning
         var dt = this.datatable.get('element');
         Dom.setStyle(dt, "float", "left");
         Dom.setStyle(this.subForm.divEl, "float", "left");
         Dom.setStyle(this.subForm.divEl, "margin-top", "30px");
         Dom.setStyle(this.subForm.divEl, "margin-left", "30px");
         this.options.parentEl.appendChild(inputEx.cn('div', null, {"clear":"both"}));
      }
      else if(this.options.editing == "celleditor") {
         
         // Set up editing flow
         var highlightEditableCell = function(oArgs) {
             var elCell = oArgs.target;
             if(YAHOO.util.Dom.hasClass(elCell, "yui-dt-editable")) {
                 this.highlightCell(elCell);
             }
         };
         this.datatable.subscribe("cellMouseoverEvent", highlightEditableCell);
         this.datatable.subscribe("cellMouseoutEvent", this.datatable.onEventUnhighlightCell);
      }
      
      
      // Insert button
      this.insertButton = inputEx.cn('button', null, null, 'Insert');
      Event.addListener(this.insertButton, 'click', this.onInsert, this, true);
      this.options.parentEl.appendChild(this.insertButton);
   
   },
   
   onCellClick: function(ev,args) {
      var target = Event.getTarget(ev);
      var column = this.datatable.getColumn(target);
      if (column.key == 'delete') {
         if (confirm('Are you sure?')) {
            this.datatable.deleteRow(target);
            this.itemRemovedEvt.fire(column);
         }
      } else {
         this.datatable.onEventShowCellEditor(ev);
      }
   },
   
   onInsert: function() {
      
      if(this.options.editing == "formeditor") {
         var index = this.datatable.getRecordIndex(this.selectedRecord)+1;
         this.datatable.addRow( {} , index);
         this.datatable.unselectRow(this.selectedRecord);
         this.datatable.selectRow(this.datatable.getTrEl(index));
         this.subForm.focus();
      }
      else if(this.options.editing == "celleditor") {
         this.datatable.addRow( {});
      }
      
      this.itemAddedEvt.fire();
   },
   
   onEventSelectRow: function(args) {
      this.selectedRecord = args.record;
      this.subForm.setValue(this.selectedRecord.getData());
   },
   
   onSaveForm: function() {
      var newvalues = this.subForm.getValue();      
      this.datatable.updateRow( this.selectedRecord , newvalues );
      
      this.itemModifiedEvt.fire();
   },
   
   
   fieldsToColumndefs: function(fields) {
      var columndefs = [];
    	for(var i = 0 ; i < fields.length ; i++) {
    	   columndefs.push( this.fieldToColumndef(fields[i]) );
    	}
    	columndefs.push({
    	   key:'delete',
    	   label:' ',
    	   formatter:function(elCell) {
            elCell.innerHTML = 'delete';
            elCell.style.cursor = 'pointer';
         }
      });
    	return columndefs;
   },

   fieldToColumndef: function(field) {
      var columnDef = {
         key: field.inputParams.name,
         sortable:true, 
         resizeable:true
      };

      // In cell editing
      if(this.options.editing && YAHOO.lang.isArray(this.options.editableFields) ) {
         if(inputEx.indexOf(field.inputParams.name, this.options.editableFields) != -1) {
             columnDef.editor = new inputEx.widget.InputExCellEditor(field);
         }
         /*var myColumnDefs = [
            {key:"uneditable"},
            {key:"address", editor: new YAHOO.widget.TextareaCellEditor()},
            {key:"city", editor: new YAHOO.inputEx.widget.InputExCellEditor({disableBtns:true})},
            {key:"state", editor: new YAHOO.widget.DropdownCellEditor({dropdownOptions:stateAbbrs,disableBtns:true})},
            {key:"amount", editor: new YAHOO.widget.TextboxCellEditor({validator:YAHOO.widget.DataTable.validateNumber})},
            {key:"active", editor: new YAHOO.widget.RadioCellEditor({radioOptions:["yes","no","maybe"],disableBtns:true})},
            {key:"colors", editor: new YAHOO.widget.CheckboxCellEditor({checkboxOptions:["red","yellow","blue"]})},
            {key:"last_login", editor: new YAHOO.widget.DateCellEditor()}
        ];*/
         
      }
      

      if(field.formatter) {
         columnDef.formatter = field.formatter;
      }
      else {
         if(field.type == "date") {
            columnDef.formatter = YAHOO.widget.DataTable.formatDate;
         }
      }
      // TODO: other formatters
      return columnDef;
   }
   
};







/**
 * The InputExCellEditor class provides functionality for inline editing
 * DataTable cell data with an INPUT TYPE=TEXT element.
 *
 * @class InputExCellEditor
 * @extends YAHOO.widget.BaseCellEditor 
 * @constructor
 * @param oConfigs {Object} (Optional) Object literal of configs.
 */
inputEx.widget.InputExCellEditor = function(inputExFieldDef) {
    this._inputExFieldDef = inputExFieldDef;
   
    this._sId = "yui-textboxceditor" + YAHOO.widget.BaseCellEditor._nCount++;
    inputEx.widget.InputExCellEditor.superclass.constructor.call(this, "inputEx", {disableBtns:true});
};

// InputExCellEditor extends BaseCellEditor
lang.extend(inputEx.widget.InputExCellEditor, YAHOO.widget.BaseCellEditor, {

   /**
    * Render a form with input type=text.
    */
   renderForm : function() {
   
      // Build the inputEx field
      this._inputExField = inputEx(this._inputExFieldDef);
      this.getContainerEl().appendChild(this._inputExField.getEl());
   
   
      this._inputExField.updatedEvt.subscribe(function(e, args) {
         //console.log("updated !", this._updatedEvtForSetValue);
         if(this._updatedEvtForSetValue) {
            this._updatedEvtForSetValue = false;
            return;
         }
         this.save();
      }, this, true);
   
       if(this.disableBtns) {
           // By default this is no-op since enter saves by default
           this.handleDisabledBtns();
       }
   },

   show: function() {
      inputEx.widget.InputExCellEditor.superclass.show.call(this); 
      this._updatedEvtForSetValue = true;
   },

   /**
    * Resets InputExCellEditor UI to initial state.
    */
   resetForm : function() {
       this._inputExField.setValue(lang.isValue(this.value) ? this.value.toString() : "");
   },

   /**
    * Sets focus in InputExCellEditor.
    */
   focus : function() {
      this._inputExField.focus();
   },

   /**
    * Returns new value for InputExCellEditor.
    */
   getInputValue : function() {
      return this._inputExField.getValue();
   }

});

// Copy static members to InputExCellEditor class
lang.augmentObject(inputEx.widget.InputExCellEditor, YAHOO.widget.BaseCellEditor);


})();