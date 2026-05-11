@echo off
cd /d C:\Users\Administrator\Documents\workspace\my-mobile-app

adb start-server
adb connect 127.0.0.1:5555
adb -s 127.0.0.1:5555 reverse tcp:8081 tcp:8081

start "Expo Server" cmd /k "cd /d C:\Users\Administrator\Documents\workspace\my-mobile-app && npx expo start --localhost"

timeout /t 8 /nobreak

adb -s 127.0.0.1:5555 shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"

pause