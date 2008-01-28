#!/bin/sh
#
#  - Concatenate all js files into build/inputex.js
#  - minify it using YUI compressor to build/inputex-min.js
#
rm -f inputex.js inputex-min.js inputex-fr.js inputex-fr-min.js
cat ../js/field.js ../js/form.js ../js/inputs.js > inputex.js
cat ../js/field.js ../js/form.js ../js/inputs.js ../js/inputs_fr.js > inputex-fr.js
java -jar ../../yuicompressor-2.2.5/build/yuicompressor-2.2.5.jar  inputex.js -o inputex-min.js --charset utf8
java -jar ../../yuicompressor-2.2.5/build/yuicompressor-2.2.5.jar  inputex-fr.js -o inputex-fr-min.js --charset utf8
