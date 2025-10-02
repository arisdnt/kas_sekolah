@echo off
REM Git Push Script dengan Timestamp
REM Usage: git-push.bat [commit-message] [branch]

setlocal enabledelayedexpansion

REM Set default values
set "MESSAGE=Update"
set "BRANCH=main"

REM Parse arguments
if not "%~1"=="" set "MESSAGE=%~1"
if not "%~2"=="" set "BRANCH=%~2"

REM Get timestamp
for /f "tokens=2 delims==" %%I in ('wmic OS Get localdatetime /value') do set "dt=%%I"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "MIN=%dt:~10,2%"
set "SS=%dt:~12,2%"
set "TIMESTAMP=%YYYY%-%MM%-%DD% %HH%:%MIN%:%SS%"

echo.
echo 🚀 Git Push Script dengan Timestamp
echo ====================================

REM Check if in git repository
if not exist ".git" (
    echo ❌ Error: Tidak berada dalam git repository!
    pause
    exit /b 1
)

REM Check git status
echo 📋 Mengecek status git...
git status --porcelain > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "!STATUS!"=="" (
    echo ⚠️  Tidak ada perubahan untuk di-commit.
    set /p CONTINUE="Lanjutkan push tanpa commit baru? (y/N): "
    if /i not "!CONTINUE!"=="y" (
        echo ✅ Script dibatalkan.
        pause
        exit /b 0
    )
) else (
    echo 📁 Files yang akan di-commit:
    git status --short
    echo.
)

REM Create commit message with timestamp
set "COMMIT_MESSAGE=%MESSAGE% - %TIMESTAMP%"
echo 💬 Commit message: !COMMIT_MESSAGE!
echo.

REM Confirm before proceeding
set /p CONFIRM="Lanjutkan dengan git add, commit, dan push? (Y/n): "
if /i "!CONFIRM!"=="n" (
    echo ✅ Script dibatalkan.
    pause
    exit /b 0
)

REM Git operations
if not "!STATUS!"=="" (
    echo 📤 Menambahkan files ke staging...
    git add .
    if errorlevel 1 (
        echo ❌ Error saat git add!
        pause
        exit /b 1
    )
    
    echo 💾 Melakukan commit...
    git commit -m "!COMMIT_MESSAGE!"
    if errorlevel 1 (
        echo ❌ Error saat git commit!
        pause
        exit /b 1
    )
)

echo 🌐 Melakukan push ke remote repository...
git push origin %BRANCH%
if errorlevel 1 (
    echo ❌ Error saat git push!
    pause
    exit /b 1
)

echo.
echo 🎉 Berhasil! Code telah di-push ke repository.
echo 📅 Commit: !COMMIT_MESSAGE!
echo 🌿 Branch: %BRANCH%
echo.
echo 📜 Commit terakhir:
git log --oneline -1

echo.
pause