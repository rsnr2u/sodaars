@echo off
echo Starting SODAARS Admin Portal (React + Vite) on http://localhost:5174...
cd /d "%~dp0..\frontend\admin"
npm.cmd run dev -- --port 5174
