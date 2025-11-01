@echo off
echo ==============================
echo 🚀 Subiendo cambios a GitHub...
echo ==============================

cd /d %~dp0
git add .
set /p msg="💬 Escribe un mensaje para el commit: "
if "%msg%"=="" set msg=Actualización automática

git commit -m "%msg%"
git push

echo ✅ Cambios subidos correctamente.
pause
