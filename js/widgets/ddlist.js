(function() {

   var inputEx = YAHOO.inputEx, DD = YAHOO.util.DragDropMgr, Dom = YAHOO.util.Dom, Event = YAHOO.util.Event;



/**
 * @class DDProxy for DDList items (used by DDList)
 * @extends YAHOO.util.DDProxy
 * @constructor
 * @param {String} id
 */
inputEx.widget.DDListItem = function(id) {

    inputEx.widget.DDListItem.superclass.constructor.call(this, id);

    this.setXConstraint(0,0);

    this.goingUp = false;
    this.lastY = 0;
};

YAHOO.extend(inputEx.widget.DDListItem, YAHOO.util.DDProxy, {

    startDrag: function(x, y) {
        // make the proxy look like the source element
        var dragEl = this.getDragEl();
        var clickEl = this.getEl();
        Dom.setStyle(clickEl, "visibility", "hidden");
        dragEl.className = clickEl.className;
        dragEl.innerHTML = clickEl.innerHTML;
    },

    endDrag: function(e) {
        Dom.setStyle(this.id, "visibility", "");
    },

    onDragDrop: function(e, id) {

        // If there is one drop interaction, the li was dropped either on the list,
        // or it was dropped on the current location of the source element.
        if (DD.interactionInfo.drop.length === 1) {

            // The position of the cursor at the time of the drop (YAHOO.util.Point)
            var pt = DD.interactionInfo.point; 

            // The region occupied by the source element at the time of the drop
            var region = DD.interactionInfo.sourceRegion; 

            // Check to see if we are over the source element's location.  We will
            // append to the bottom of the list once we are sure it was a drop in
            // the negative space (the area of the list without any list items)
            if (!region.intersect(pt)) {
                var destEl = Dom.get(id);
                if (destEl.nodeName.toLowerCase() != "li") {
                   var destDD = DD.getDDById(id);
                   destEl.appendChild(this.getEl());
                   destDD.isEmpty = false;
                   DD.refreshCache();
                }
            }

        }
    },

    onDrag: function(e) {

        // Keep track of the direction of the drag for use during onDragOver
        var y = Event.getPageY(e);

        if (y < this.lastY) {
            this.goingUp = true;
        } else if (y > this.lastY) {
            this.goingUp = false;
        }

        this.lastY = y;
    },

    onDragOver: function(e, id) {
    
        var srcEl = this.getEl();
        var destEl = Dom.get(id);

        // We are only concerned with list items, we ignore the dragover
        // notifications for the list.
        if (destEl.nodeName.toLowerCase() == "li") {
            var orig_p = srcEl.parentNode;
            var p = destEl.parentNode;

            if (this.goingUp) {
                p.insertBefore(srcEl, destEl); // insert above
            } else {
                p.insertBefore(srcEl, destEl.nextSibling); // insert below
            }

            DD.refreshCache();
        }
    }
});


/**
 * @class Create a sortable list 
 * @extends inputEx.widget.DDList
 * @constructor
 * @param {Object} options Options:
 * <ul>
 *	   <li>id: id of the ul element</li>
 *	   <li>value: initial value of the list</li>
 * </ul>
 */
inputEx.widget.DDList = function(options) {
   
   this.ul = inputEx.cn('ul');
   
   if(options.id) {
      this.ul.id = options.id;
   }
   
   if(options.value) {
      this.setValue(options.value);
   }
   
   // append it immediatly to the parent DOM element
	if(options.parentEl) {
	   if( YAHOO.lang.isString(options.parentEl) ) {
	     Dom.get(options.parentEl).appendChild(this.ul);  
	   }
	   else {
	      options.parentEl.appendChild(this.ul);
      }
	}
};

inputEx.widget.DDList.prototype = {
   
   addItem: function(value) {
      var li = inputEx.cn('li', {className: 'inputEx-DDList-item'});
      li.appendChild( inputEx.cn('span', null, null, value) );
      var removeLink = inputEx.cn('a', null, null, "remove"); 
      li.appendChild( removeLink );
      Event.addListener(removeLink, 'click', function(e) {
         var a = Event.getTarget(e);
         var li = a.parentNode;
         this.ul.removeChild(li);
      }, this, true);
      new inputEx.widget.DDListItem(li);
      this.ul.appendChild(li);
   },
   
   removeItem: function(i) {
      this.ul.removeChild(this.ul.childNodes[i]);
   },
   
   getValue: function() {
      var value = [];
      for(var i = 0 ; i < this.ul.childNodes.length ; i++) {
         value.push(this.ul.childNodes[i].childNodes[0].innerHTML);
      }
      return value;
   },
   
   updateItem: function(i,value) {
      this.ul.childNodes[i].childeNodes[0].innerHTML = value;
   },
   
   setValue: function(value) {
      for(var i = 0 ; i < value.length ; i++) {
         if(this.ul.childNodes.length > i) {
            this.updateItem(i, value[i]);
         }
         else {
            this.addItem(value[i]);
         }
      }
   }
   
};


})();