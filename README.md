# Athlete Training Tracker

Mobile workout tracking app built with Expo React Native, Spring Boot, and PostgreSQL.

## Get Started

Install dependencies:

```bash
npm install
```

Start the mobile app:

```bash
npm start
```

If Android says no development build is installed, install it once on the emulator:

```bash
npm run install:android
```

After the install finishes, use `npm start` for normal daily development.

Clear Metro cache if you see stale behavior:

```bash
npm run start:clear
```

The app talks to the Java REST API through `extra.apiBaseUrl` in `app.json`. On Android emulators this is usually `http://10.0.2.2:8080`. Run PostgreSQL and the backend locally first.

## Frontend Structure

- `app/` contains Expo Router screens and navigation groups.
- `features/auth/` contains auth state, secure auth storage, and auth UI.
- `features/home/` contains dashboard-specific UI.
- `features/workouts/` contains workout types, storage, notifications, and workout UI.
- `features/profile/` contains profile storage.
- `features/shared/` contains shared app infrastructure such as API helpers.
- `components/` is for generic reusable UI.

## Backend & PostgreSQL

Registration and login hit `POST /api/v1/auth/register` and `POST /api/v1/auth/login`. User rows are stored in PostgreSQL table `app_users`.

Configure JDBC in `backend/src/main/resources/application.properties`, then run:

```bash
npm run backend
```

The local runner uses these default PostgreSQL values unless you override them with environment variables:

```powershell
DB_URL=jdbc:postgresql://127.0.0.1:5432/athlete_training
DB_USERNAME=karasdev
DB_PASSWORD=123123
```

After registering in the app, verify the database:

```sql
SELECT id, email, created_at FROM app_users ORDER BY created_at DESC LIMIT 10;
```

Workout-save notifications are local app notifications created on the device with `expo-notifications`; no external push service setup is required.

## Build Android APK

Build a release APK:

```powershell
npm run build:apk
```

The APK is created at:

```powershell
dist\athlete-training-tracker-release.apk
```

Build a development APK:

```powershell
npm run build:apk:debug
```

For Google Play production distribution, build an Android App Bundle (`.aab`) and use a real release keystore instead of the debug signing config.

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Spring Boot documentation](https://spring.io/projects/spring-boot)
