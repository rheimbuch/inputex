(function() {
/**
 * Add inputEx modules to a YUI loader
 * @static
 * @param {YUILoader} yuiLoader YUI Loader instance
 * @param {String} inputExPath (optional) inputExPath
 */
YAHOO.addInputExModules = function(yuiLoader, inputExPath) {
	var pathToInputEx = inputExPath || '../';
	var modules = [
		{
			name: 'inputex-css',
			type: 'css',
			fullpath: pathToInputEx+'css/inputEx.css',
			requires: ['reset', 'fonts']
		},
   	{
   	   name: 'inputex',
   	   type: 'js',
   	   fullpath: pathToInputEx+'js/inputex.js',
   	 	varName: 'inputEx',
   		requires: ['yahoo', 'dom', 'event', 'inputex-css']
   	},
		{
			name: 'inputex-field',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/Field.js',
	  	   varName: 'inputEx.Field',
			requires: ['inputex']
		},
		{
			name: 'inputex-group',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/Group.js',
	  	   varName: 'inputEx.Group',
			requires: ['inputex-field']
		},
		{
			name: 'inputex-form',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/Form.js',
	  	   varName: 'inputEx.Form',
			requires: ['inputex-group']
		},
		{
			name: 'inputex-stringfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/StringField.js',
	  	   varName: 'inputEx.StringField',
			requires: ['inputex-field']
		},
		{
			name: 'inputex-emailfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/EmailField.js',
	  	   varName: 'inputEx.EmailField',
			requires: ['inputex-stringfield']
		},
		{
			name: 'inputex-urlfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/UrlField.js',
	  	   varName: 'inputEx.UrlField',
			requires: ['inputex-stringfield']
		},
		{
			name: 'inputex-selectfield',
			type: 'js',
	  	   fullpath: pathToInputEx+'js/fields/SelectField.js',
	  	   varName: 'inputEx.SelectField',
			requires: ['inputex-field']
		}
	];
	for(var i = 0 ; i < modules.length ; i++) {
		yuiLoader.addModule(modules[i]);
	}
};

})();