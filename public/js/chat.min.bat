@echo off
set inputlist=%inputlist% --js chat.js



set outputfilename= --js_output_file chat.min.js
echo %inputlist%
echo %outputfilename%

java -jar compiler.jar %inputlist% %outputfilename%
echo �ļ�������� %outputfilename%
@pause>nul
