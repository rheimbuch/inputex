
/**
 *  Array.prototype.indexOf
 */
if(!Array.prototype.indexOf) {
   Array.prototype.indexOf = function(object) {
      for (var i = 0, length = this.length; i < length; i++)
         if (this[i] == object) return i;
      return -1;
   };
}

Element.prototype.appendTo = function(el) {
   el.appendChild(this);
   return this;
};

/**
 * Functions used to create nodes
 * and set node attributes
 */
var isIE = /MSIE/.test(navigator.userAgent);
if(!sn)
var sn = function(el,domAttributes,styleAttributes){
    if(!el){
       return;
    }
    if(domAttributes){
       for(var i in domAttributes){
          var domAttribute = domAttributes[i];
          if(typeof (domAttribute)=="function"){
             continue;
          }
          if(isIE&&i=="type"&&(el.tagName=="INPUT"||el.tagName=="SELECT")){
             continue;
          }
          if(i=="className"){
             i="class";
             el.className=domAttribute;
          }
          if(domAttribute!==el.getAttribute(i)){
             try{
                if(domAttribute===false){
                   el.removeAttribute(i);
                }else{
                   el.setAttribute(i,domAttribute);
                }
             }
             catch(err){
                console.log("WARNING: Couldnt sn for "+el.tagName+", attr "+i+", val "+domAttribute);
             }
          }
       }
    }
    if(styleAttributes){
       for(var i in styleAttributes){
          if(typeof (styleAttributes[i])=="function"){
             continue;
          }
          if(el.style[i]!=styleAttributes[i]){
             el.style[i]=styleAttributes[i];
          }
       }
    }
 };

if(!cn)
var cn = function(tag, domAttributes, styleAttributes, innerHTML){
    var el=document.createElement(tag);
    sn(el,domAttributes,styleAttributes);
    if(innerHTML){
       el.innerHTML = innerHTML;
    }
    return el;
 };
