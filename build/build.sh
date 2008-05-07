#!/bin/sh
#
#  - Concatenate all js files into build/inputex.js
#  - minify it using YUI compressor to build/inputex-min.js
#  - minify the CSS file to build/inputex-min.css

# Remove previous files
rm -f inputex-all.js inputex-min.js inputex-min.css

# Concatenate all the js files
cat ../js/inputex.js ../js/Field.js ../js/Group.js ../js/Form.js ../js/fields/StringField.js ../js/fields/AutoComplete.js ../js/fields/CheckBox.js ../js/fields/ColorField.js ../js/fields/DateField.js ../js/fields/EmailField.js ../js/fields/HiddenField.js ../js/fields/InPlaceEdit.js ../js/fields/IPv4Field.js ../js/fields/ListField.js ../js/fields/PairField.js ../js/fields/PasswordField.js ../js/fields/RTEField.js ../js/fields/SelectField.js ../js/fields/Textarea.js ../js/fields/UneditableField.js ../js/fields/UpperCaseField.js ../js/fields/UrlField.js > inputex-all.js

# Minify using yui compressor
java -jar ../../../Outils/yuicompressor-2.2.5/build/yuicompressor-2.2.5.jar inputex-all.js -o inputex-min.js --charset utf8

# Minify CSS using yui compressor
java -jar ../../../Outils/yuicompressor-2.2.5/build/yuicompressor-2.2.5.jar ../css/inputEx.css -o inputex-min.css --charset utf8