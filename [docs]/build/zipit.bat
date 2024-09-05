REM requires jar from the JDK
@echo off
set ARCHIVE=%CD%\build.zip

where -q jar
IF ERRORLEVEL 1 (
    ECHO "*** jar application is missing. Ensure it is installed and placed in your PATH. ***"
    EXIT /B
)

del "%ARCHIVE%"

