@echo off
title 經典故事書
rem 雙擊這個檔案：在本機開一個小伺服器，並用瀏覽器打開故事書。關掉這個黑色視窗就會停止。
rem （這個檔案用 Big5 存檔，cmd 才讀得懂中文）
cd /d "%~dp0public"
if "%PORT%"=="" set PORT=8767

rem 等伺服器啟動 1 秒後再開瀏覽器
start "" cmd /c "timeout /t 1 >nul & start http://localhost:%PORT%"

echo.
echo   經典故事書已在瀏覽器打開：http://localhost:%PORT%
echo   要結束時，直接關掉這個視窗。
echo.

where python >nul 2>nul && (python -m http.server %PORT% & goto :end)
where py >nul 2>nul && (py -m http.server %PORT% & goto :end)
where npx >nul 2>nul && (npx --yes http-server -p %PORT% -c-1 & goto :end)

echo   找不到 Python 或 Node.js，沒辦法啟動伺服器。
echo   請先安裝 Python：https://www.python.org/downloads/
echo   （安裝時記得勾選 "Add Python to PATH"）
pause
:end
