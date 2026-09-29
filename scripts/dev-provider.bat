@echo off
echo Starting SODAARS Provider Portal (React + Vite) on http://localhost:5173...
cd /d "%~dp0..\frontend\provider"
npm.cmd run dev -- --port 5173
