/**
 * refer to: http://code.google.com/p/inputex/issues/detail?id=99
 *
 * Usage:
 * <script type="text/javascript" src="http://yui.yahooapis.com/3.0.0pr1/build/yui/yui-min.js"></script>
 * <script type="text/javascript" src="inputeg.js"></script>
 *
 * It assumes the followng:
 * ./inputEg.js - base path
 */


(function () {
    if (typeof(YUI) === 'undefined') { alert('please include YUI3 before loading inputeg.js')}

    /**
     * preload required libraries. for the default css in svn, remember to set mime-type correctly:
     * svn propset svn:mime-type text/css examples/css/syntaxhighlighter-1.5.2/SyntaxHighlighter.css
     * svn propset svn:mime-type application/x-shockwave-flash examples/js/syntaxhighlighter-1.5.2/clipboard.swf
     * svn propset svn:mime-type application/x-javascript examples/js/syntaxhighlighter-1.5.2/shCore.js
     * svn propset svn:mime-type application/x-javascript examples/js/syntaxhighlighter-1.5.2/shBrushXml.js
     * svn propset svn:mime-type application/x-javascript examples/js/syntaxhighlighter-1.5.2/shBrushJScript.js
     * svn commit -m "updated mime-type"
     */
    YUI({modules:{
        'dpSyntaxHighlighter-css':{fullpath:'http://inputex.googlecode.com/svn/trunk/examples/css/syntaxhighlighter-1.5.2/SyntaxHighlighter.css',type:'css'},
        'dpSyntaxHighlighter-core':{fullpath:'http://inputex.googlecode.com/svn/trunk/examples/js/syntaxhighlighter-1.5.2/shCore.js',type:'js'},
        'dpSyntaxHighlighter-xml':{fullpath:'http://inputex.googlecode.com/svn/trunk/examples/js/syntaxhighlighter-1.5.2/shBrushXml.js',type:'js',requires:['dpSyntaxHighlighter-css','dpSyntaxHighlighter-core']},
        'dpSyntaxHighlighter-js':{fullpath:'http://inputex.googlecode.com/svn/trunk/examples/js/syntaxhighlighter-1.5.2/shBrushJScript.js',type:'js',requires:['dpSyntaxHighlighter-css','dpSyntaxHighlighter-core']}
    }}).use('dpSyntaxHighlighter-js', 'dpSyntaxHighlighter-xml')

    /**
     * Every example is an inputEg instance. A inputEg typically consists of the following visual elements:
     *  - Header
     *  - Description
     *  - Demo: executed JavaScript
     *  - Source: JavaScript source
     *  - (new) DOM: DOM source
     *
     * Header and Description are not managed by inputEg. However, they should follow the DOM require in order for inputEg
     * to set style for them.
     * <div id="eg1">
     *   <div class="header">
     *   <div class="description"> TODO: double check if we used to use 'desc' or 'description'
     *   // the following are dynamically created by inputEg
     *   <div class="demo">
     *   <div class="js">
     *   <div class="dom">
     * </div>
     *
     * Configuration:
     *  - parentEl: the top level DOM element for the example
     */
    YUI.add("inputEg", function(Y) {
        var inputEg = function(cfg) {
            inputEg.superclass.constructor.apply(this, arguments);
            //this.publishEvent("inputEg:handshaked");
            //Y.Event.addListener(window, 'beforeunload', Y.bind(this.handleBeforeUnload, this));
        };
        inputEg.NAME = "inputEg";
        inputEg.ATTRS = {
        }
        //Y.augment(inputEg, Y.Event.Target);

        Y.extend(inputEg, Y.Base, {
            initializer : function(cfg) {
                dp.SyntaxHighlighter.ClipboardSwf = 'http://inputex.googlecode.com/svn/trunk/examples/js/syntaxhighlighter-1.5.2/clipboard.swf'
            },

            renderDOM:function() { //follow YUI to call it 'DOM' instead of 'Dom'

            },
            renderComponent:function() {

            },



            highlightAll:function() {
                Y.log('highlightAll', 'trace', 'inputEg');

                dp.SyntaxHighlighter.HighlightAll('code');
            }
        });
        Y.inputEg = inputEg;

    }, '3.0.0', {requires:['base', 'io', 'node', 'json','queue','cookie']});
})();
