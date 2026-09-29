@echo off
echo Starting SODAARS Backend API (Laravel) on http://localhost:8000...
cd /d "%~dp0..\backend\api"
php artisan serve --port=8000
