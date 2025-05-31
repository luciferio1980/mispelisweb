@echo off
setlocal enabledelayedexpansion

REM Carpeta donde están las imágenes (miniaturas)
set "VIDEO_DIR=C:\Users\lucif\Desktop\web\videos"
REM Salida del index
set "OUTPUT_HTML=C:\Users\lucif\Desktop\web\index.html"

REM Tamaño miniatura
set WIDTH=200
set HEIGHT=300

REM Borra index.html si existe
if exist "%OUTPUT_HTML%" del "%OUTPUT_HTML%"

REM Crear encabezado HTML
(
echo ^<!DOCTYPE html^>
echo ^<html lang="es"^>
echo ^<head^>
echo ^<meta charset="UTF-8"^>
echo ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo ^<title^>Catálogo de Películas^</title^>
echo ^<style^>
echo body { font-family: Arial, sans-serif; background:#222; color:#eee; padding:20px; }
echo .grid-container { display: flex; flex-wrap: wrap; gap: 15px; justify-content: flex-start; }
echo .grid-item { width: 15%%; min-width: 150px; text-align: center; }
echo .grid-item img { width: 100%%; height: auto; border-radius: 5px; }
echo a { color: #89c; text-decoration: none; display: block; margin-top: 8px; font-weight: bold; }
echo a:hover { text-decoration: underline; }
echo ^</style^>
echo ^</head^>
echo ^<body^>
echo ^<h1^>Catálogo de Películas^</h1^>
echo ^<div class="grid-container"^>
) > "%OUTPUT_HTML%"

REM Procesar cada jpg
for %%F in ("%VIDEO_DIR%\*.jpg") do (
    set "filename=%%~nF"
    set "cleanname=!filename:-= !"
    set "cleanname=!cleanname:_= !"

    REM Capitalizar simple
    call :capitalize cleanname cleanname

    REM Redimensionar imagen (sobrescribe)
    magick "%%F" -resize %WIDTH%x%HEIGHT%^> "%%F" 

    REM Añadir bloque HTML
    echo ^<div class="grid-item"^> >> "%OUTPUT_HTML%"
    echo ^<a href="repro.html?file=!filename!"^> >> "%OUTPUT_HTML%"
    echo ^<img src="videos/%%~nxF" alt="!cleanname!" /^> >> "%OUTPUT_HTML%"
    echo !cleanname! >> "%OUTPUT_HTML%"
    echo ^</a^> >> "%OUTPUT_HTML%"
    echo ^</div^> >> "%OUTPUT_HTML%"
)

REM Cierre HTML
(
echo ^</div^>
echo ^</body^>
echo ^</html^>
) >> "%OUTPUT_HTML%"

echo Index generado en %OUTPUT_HTML%
pause
exit /b

REM Capitaliza palabras simples
:capitalize
setlocal enabledelayedexpansion
set "str=!%1!"
set "result="
for %%a in (!str!) do (
    set "word=%%a"
    set "first=!word:~0,1!"
    set "rest=!word:~1!"
    set "first=!first:A=a!"
    set "first=!first:B=b!"
    set "first=!first:C=c!"
    set "first=!first:D=d!"
    set "first=!first:E=e!"
    set "first=!first:F=f!"
    set "first=!first:G=g!"
    set "first=!first:H=h!"
    set "first=!first:I=i!"
    set "first=!first:J=j!"
    set "first=!first:K=k!"
    set "first=!first:L=l!"
    set "first=!first:M=m!"
    set "first=!first:N=n!"
    set "first=!first:O=o!"
    set "first=!first:P=p!"
    set "first=!first:Q=q!"
    set "first=!first:R=r!"
    set "first=!first:S=s!"
    set "first=!first:T=t!"
    set "first=!first:U=u!"
    set "first=!first:V=v!"
    set "first=!first:W=w!"
    set "first=!first:X=x!"
    set "first=!first:Y=y!"
    set "first=!first:Z=z!"

    REM Mayúscula primera letra
    set "first=!first:A=A!"
    set "first=!first:B=B!"
    set "first=!first:C=C!"
    set "first=!first:D=D!"
    set "first=!first:E=E!"
    set "first=!first:F=F!"
    set "first=!first:G=G!"
    set "first=!first:H=H!"
    set "first=!first:I=I!"
    set "first=!first:J=J!"
    set "first=!first:K=K!"
    set "first=!first:L=L!"
    set "first=!first:M=M!"
    set "first=!first:N=N!"
    set "first=!first:O=O!"
    set "first=!first:P=P!"
    set "first=!first:Q=Q!"
    set "first=!first:R=R!"
    set "first=!first:S=S!"
    set "first=!first:T=T!"
    set "first=!first:U=U!"
    set "first=!first:V=V!"
    set "first=!first:W=W!"
    set "first=!first:X=X!"
    set "first=!first:Y=Y!"
    set "first=!first:Z=Z!"

    set "word=!first!!rest!"
    set "result=!result! !word!"
)
endlocal & set "%2=%result:~1%"
exit /b
