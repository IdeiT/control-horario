@echo off
setlocal enabledelayedexpansion

echo Cargando variables desde .env ...

REM Comprobar si .env existe
if not exist ".env" (
    echo No se encontró el archivo .env
    exit /b 1
)

REM Leer el archivo .env línea a línea
for /f "usebackq tokens=* delims=" %%a in (".env") do (
    set "line=%%a"

    REM Saltar lineas vacías o comentarios
    if not "!line!"=="" (
        echo !line! | findstr /b "#" >nul
        if errorlevel 1 (
            for /f "tokens=1,2 delims==" %%b in ("!line!") do (
                set "%%b=%%c"
            )
        )
    )
)

echo Variables cargadas correctamente.
echo Lanzando mvn spring-boot:run...
echo.

mvn spring-boot:run

endlocal