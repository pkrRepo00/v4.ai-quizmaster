@echo off
cd /d "%~dp0"
start cmd /k "npm run dev"
timeout /t 5 >nul
start http://localhost:5173
