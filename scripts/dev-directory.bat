@echo off
echo Starting SODAARS Public Directory (Next.js) on http://localhost:3000...
cd /d "%~dp0..\website\directory"
npm.cmd run dev -- -p 3000
