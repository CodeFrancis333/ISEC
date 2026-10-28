@echo off
setlocal
set "PATH=%~dp0.tools\runtime\node-v22.14.0-win-x64;%PATH%"
cd /d "%~dp0isec-website"
if not exist node_modules (
    call npm.cmd ci
    if errorlevel 1 exit /b 1
)
call npm.cmd run dev -- --host 127.0.0.1
