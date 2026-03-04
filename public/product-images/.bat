@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "TARGET_DIR=%CD%"
echo Downloading images to "%TARGET_DIR%"

for /L %%I in (1,1,300) do (
  set "PADDED=00%%I"
  set "FILE_NAME=product-!PADDED:~-3!.jpg"
  set "FILE_PATH=%TARGET_DIR%\!FILE_NAME!"

  if exist "!FILE_PATH!" (
    echo Skipping existing !FILE_NAME!
  ) else (
    echo Downloading !FILE_NAME!
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$seed = [guid]::NewGuid().ToString('N');" ^
      "$url = 'https://picsum.photos/seed/' + $seed + '/640/480';" ^
      "Invoke-WebRequest -Uri $url -OutFile '%TARGET_DIR%\!FILE_NAME!' -MaximumRedirection 5"

    if errorlevel 1 (
      echo Failed to download !FILE_NAME!
    )
  )
)

echo Done.
endlocal
