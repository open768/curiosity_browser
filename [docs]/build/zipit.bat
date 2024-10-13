rem @echo off
REM requires 7z
set START=%CD%
set ARCHIVE=%CD%\curiosity_browser_release.zip

where -q 7z
IF ERRORLEVEL 1 (
    ECHO "*** 7z application is missing. Ensure 7zip is installed in your PATH. ***"
    EXIT /B
) else (
	echo 7z is found
)

if exist "%ARCHIVE%" (
	del /f "%ARCHIVE%"
) else (
	echo no archive file to delete
)
	

7z a -tzip -mx8 -xr!*\.git -xr!*/phpshell "%ARCHIVE%" ..\..\..\phpinc
7z a -tzip -mx8 -xr!*\.git "%ARCHIVE%" ..\..\..\spaceinc
7z a -tzip -mx8 -xr!*\.git -xr!*node_modules "%ARCHIVE%" ..\..\..\..\js\jsinc
pushd ..\..\..\
7z a -tzip -mx8 -x!curiosity_browser\bin -x!curiosity_browser\[objdata] -x!curiosity_browser\[cache] -x!curiosity_browser\[docs] -x!curiosity_browser\node_modules -x!curiosity_browser\[db] -x!curiosity_browser\[backup] -x!curiosity_browser\.git -xr!*google*.html -x!curiosity_browser\php\test -x!curiosity_browser\php\app-config\app-secret.php  "%ARCHIVE%" curiosity_browser
popd
