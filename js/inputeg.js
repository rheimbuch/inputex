/**
 * refer to: http://code.google.com/p/inputex/issues/detail?id=99
 *
 * Usage:
 * <script type="text/javascript" src="http://yui.yahooapis.com/3.0.0pr1/build/yui/yui-min.js"></script>
 * <script type="text/javascript" src="inputeg.js"></script>
 *
 * It assumes the followng:
 * ./inputEg.js - base path
 *
 * TODO: the inputEg could actually be made as a inputEx Form. do it after the YUI3 upgrade
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
        var inputEg = function(el, cfg) {
            inputEg.superclass.constructor.apply(this, arguments);

            //the first arg is element or element ID

            //this.set('el', Y.Lang.isString(el) ? Y.get(el) : el );
            //this.publishEvent("inputEg:handshaked");
            //Y.Event.addListener(window, 'beforeunload', Y.bind(this.handleBeforeUnload, this));
        };
        inputEg.NAME = "inputEg";
        inputEg.ATTRS = {
            el:{
                set:function(el) {
                    var node = (Y.Lang.isString(el) ? Y.get('#' + el) : el);
                    if (Y.Lang.isNull(node)) {
                        Y.log("can't find an existing node, append a new one at the end. el: " + el, 'warn', 'inputEg');
                        node = Y.Node.create('<div id="' + el + '"/>');
                        Y.get('body').appendChild(node);
                    }
                    return node;
                }
            },
            hd:{value:null}, //name as 'hd' following YUI Panel
            desc:{value:null},
            js:{value:null}
        }
        //Y.augment(inputEg, Y.Event.Target);

        Y.extend(inputEg, Y.Base, {

            initializer : function(cfg) {
                var args = cfg.details;
                //if no 'hd/desc' in cfg, set to any value in existed DOM
                if (Y.Lang.isUndefined(args[0].hd) && !Y.Lang.isNull(this.get('el').query('.hd'))) {
                    this.set('hd', this.get('el').query('.hd').get('innerHTML'))
                }
                if (Y.Lang.isUndefined(args[0].desc) && !Y.Lang.isNull(this.get('el').query('.desc'))) {
                    this.set('desc', this.get('el').query('.desc').get('innerHTML'))
                }
                if (Y.Lang.isUndefined(args[0].script) && !Y.Lang.isNull(this.get('el').query('.js'))) {
                    this.set('js', this.get('el').query('.js').get('innerHTML'))
                }


                dp.SyntaxHighlighter.ClipboardSwf = 'http://inputex.googlecode.com/svn/trunk/examples/js/syntaxhighlighter-1.5.2/clipboard.swf'
                Y.log('initializer() - done - hd: ' + this.get('hd') + ', desc: ' + this.get('desc'), 'debug', 'inputEg');
            },

            renderDOM:function() { //follow YUI to call it 'DOM' instead of 'Dom'
                var staticNodes = ['hd','desc','demo']
                for (var i = 0,sNode; sNode = staticNodes[i]; i++) {
                    var n = this.get('el').query('.' + sNode)
                    if (Y.Lang.isNull(n)) {
                        n = Y.Node.create('<div class="' + sNode + '"></div>');
                        if (!Y.Lang.isUndefined(this.get(sNode))) { n.set('innerHTML', this.get(sNode)) }
                        this.get('el').appendChild(n);
                    }
                }

                var dynamicNodes = ['js','dom']
                var nodeClassMappings = {'dom':'html','js':'js'} //TODO: move to global 
                for (var i = 0,dNode; dNode = dynamicNodes[i]; i++) {
                    var n = this.get('el').query('.' + dNode)
                    if (!Y.Lang.isNull(n)) { this.get('el').removeChild(n)}
                    Y.log('codeNode: ' + dNode + ', class: ' + nodeClassMappings[dNode])
                    this.get('el').appendChild(Y.Node.create('<pre name="code" class="' + nodeClassMappings[dNode] + '"></pre>'))
                }
                //Y.log('processing node: ' + dNode + ', n: ' + n)
            },
            renderComponents:function() {
                //this.get('el').query('.js').set('innerHTML', this.get('js'))
            },

            render:function() {
                try {
                    Y.log('render() - begin', 'debug', 'inputEg')
                    this.renderDOM();
                    this.renderComponents();
                    Y.log('dp.SyntaxHighlighter.HighlightAll()', 'debug', 'inputEg');
                    dp.SyntaxHighlighter.HighlightAll('code');
                } catch(e) {
                    Y.log(e, 'error', 'inputEg');
                }
            }
        });
        Y.inputEg = inputEg;

    }, '3.0.0', {requires:['base', 'io', 'node', 'json','queue','cookie']});
})();
