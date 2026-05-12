# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

   Clear Metro cache if you see stale behavior:

   ```bash
   npm run start:clear
   ```

The app talks to the **Java REST API** (`extra.apiBaseUrl` in `app.json`, often `http://10.0.2.2:8080` on Android emulators). Run PostgreSQL and the backend locally first (see below).

## Backend & PostgreSQL

- **Registration and login** hit `POST /api/v1/auth/register` and `POST /api/v1/auth/login`. User rows are stored in PostgreSQL table **`app_users`** via Spring Data JPA (`AuthService.register` → `users.save(...)`).
- Configure JDBC in `backend/src/main/resources/application.properties` (URL, user, password for your DB).
- Push notifications are sent by the Spring backend through Firebase Admin. Download a Firebase service account JSON from Firebase Console and set `FIREBASE_SERVICE_ACCOUNT_PATH` to that local file path. Do not commit that service account file.
- Run the API:

  ```bash
  cd backend
  # PowerShell example:
  # $env:DB_PASSWORD="your-postgres-password"
  # $env:FIREBASE_SERVICE_ACCOUNT_PATH="C:\secrets\firebase-service-account.json"
  mvn spring-boot:run
  ```

### Verify registration in PostgreSQL

After registering in the app:

```sql
SELECT id, email, created_at FROM app_users ORDER BY created_at DESC LIMIT 10;
```

You should see the email you used. Registrations are stored only in your PostgreSQL database (table `app_users`).

## LDPlayer / adb (optional)

```powershell
cd C:\Users\Administrator\Documents\workspace\my-mobile-app
adb kill-server
adb start-server
adb connect 127.0.0.1:5555
adb devices
npx expo start --localhost
```

Another shell:

```powershell
adb -s 127.0.0.1:5555 reverse tcp:8081 tcp:8081
adb -s 127.0.0.1:5555 shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"
```

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

## Join the community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
