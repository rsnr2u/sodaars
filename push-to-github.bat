@echo off
setlocal
title SODAARS - Push to GitHub

echo ============================================================
echo   Pushing SODAARS to https://github.com/rsnr2u/sodaars.git
echo ============================================================
echo.
echo Launching push... A browser window may open to authorize GitHub.
echo.

"C:\Users\DIGI TAALKS\AppData\Local\Programs\MinGit\cmd\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo   SUCCESS! SODAARS has been pushed to GitHub successfully.
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo   Push failed or was cancelled. Check output above.
    echo ============================================================
)

echo.
pause
