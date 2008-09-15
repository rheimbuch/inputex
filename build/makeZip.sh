#!/bin/sh
cd ../..
zip -vr inputex.zip inputex -x "*.svn*" "*.DS_Store*" "*logo-inputex.xcf" "*build.sh" "*makeZip.sh" "*generateDoc.sh" "*inputExCL*" "*inputExDb*" "*inputExRdf*" "*/doc/examples.html" "*_content.html" "*inputex.conf"