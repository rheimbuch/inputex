#!/bin/sh
echo "=== Generating doc ==="
cd ../../../Outils/jsdoc_toolkit-1.4.1
java -jar app/js.jar app/run.js -c=../../Projets/inputex/doc/inputex.conf ../../Projets/inputex/js 
echo "=== Generating doc ==="