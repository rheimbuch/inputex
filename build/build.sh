#!/bin/sh
#
#  - Concatenate all js files into build/inputex.js
#  - minify it using YUI compressor to build/inputex-min.js
#

# Remove previous files
rm -f inputex.js inputex-min.js

# Concatenate all the js files
cat ../js/inputex.js ../js/Field.js ../js/Group.js ../js/Form.js ../js/fields/CheckBox.js ../js/fields/ColorField.js ../js/fields/EmailField.js ../js/fields/IPv4Field.js ../js/fields/ListField.js ../js/fields/PasswordField.js ../js/fields/RTEField.js ../js/fields/SelectField.js ../js/fields/Textarea.js ../js/fields/UrlField.js ../js/fields/TypeField.js > inputex.js

# Minify using yui compressor
java -jar ../../yuicompressor-2.2.5/build/yuicompressor-2.2.5.jar inputex.js -o inputex-min.js --charset utf8
