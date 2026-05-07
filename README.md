# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Push notifications on LDPlayer (Android 9)

This project is configured to use **Android FCM device tokens** (via `expo-notifications`) so you can test push notifications on **LDPlayer** (requires Google Play services).

### Prerequisites

- Install **Google Play Store** on LDPlayer and sign in.
- Download `google-services.json` from Firebase Console:
  - Project Settings → Your apps → Android → download `google-services.json`
  - Place it at the project root as `./google-services.json` (required by `app.json`).

### Build an APK (development build)

1. Install the dev client dependency:

   ```bash
   npx expo install expo-dev-client
   ```

2. Build an APK:

   ```bash
   npx eas build -p android --profile development
   ```

3. Install the APK into LDPlayer, open the app, log in, and copy the printed **Push token** from the console.

### Send a test push (FCM, manual)

Use Firebase Cloud Messaging to send a notification to the FCM registration token you copied:

- Firebase Console → Messaging → Send test message → paste the token.

## Automatic push via Firestore + Cloud Functions

Pushes are also sent automatically when a doc is created at:

```
users/{uid}/notifications/{nid}
```

with shape `{ title, body, data? }`. The Cloud Function in `functions/src/index.ts` reads the user's FCM tokens stored under `users/{uid}/fcmTokens/...` and sends an FCM multicast message. Stale tokens are pruned automatically.

Demo trigger: creating a workout (`app/(tabs)/add-workout.tsx`) writes such a doc, so a push arrives a few seconds after saving a workout.

### Firebase project prerequisites (one-time)

- **Cloud Firestore enabled**: Firebase Console → Build → Firestore Database → Create database (Production mode).
- **Blaze plan** (pay-as-you-go) is required for Cloud Functions v2. The free tier is sufficient for testing.
- `expo-notifications` is already configured to return FCM device tokens on Android.

## Automatic push without billing (local watcher)

If you do **not** want to enable billing, you can run a **local push watcher** on your PC. It listens for new docs at `users/{uid}/notifications/{nid}` and sends FCM using the Admin SDK.

### Setup (one-time)

1. Create a **service account** in Firebase Console:
   - Project Settings → Service accounts → **Generate new private key**
   - Save the JSON somewhere safe (do **not** commit it).

2. Set environment variables (PowerShell example):

```powershell
$env:FIREBASE_PROJECT_ID="my-mobile-app-c9b3f"
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\service-account.json"
```

3. Install dependencies:

```bash
npm install
```

### Run the watcher

```bash
npm run watch:push
```

Leave it running. When your app creates a Firestore doc under `users/{uid}/notifications/...` (e.g., when saving a workout), the watcher will send the push.

### Deploy

```bash
# one-time
npm install -g firebase-tools
firebase login

# from the project root
firebase deploy --only firestore:rules,functions
```

Project linkage is already in `.firebaserc` (`my-mobile-app-c9b3f`).

### Verify it works

1. Reinstall the latest APK on LDPlayer (so the new client code that writes Firestore is included).
2. Log in. Confirm in Firebase Console → Firestore that a doc appears at `users/{uid}/fcmTokens/...`.
3. Add a workout in the app. Within a few seconds a push notification appears on LDPlayer.
4. (Optional manual test) In Firestore, create a doc at `users/{uid}/notifications/test1` with fields:
   - `title`: `"Hi"`
   - `body`: `"Triggered from Firestore"`
   The push should arrive on the device.

### Tail Cloud Function logs

```bash
firebase functions:log --only sendOnNotificationCreate
```

## Misc dev commands

cd C:\Users\Administrator\Documents\workspace\my-mobile-app
adb kill-server
adb start-server
adb connect 127.0.0.1:5555
adb devices
npx expo start --localhost

another shell
adb -s 127.0.0.1:5555 reverse tcp:8081 tcp:8081
adb -s 127.0.0.1:5555 shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"


```powershell
$env:FIREBASE_PROJECT_ID="my-mobile-app-c9b3f"
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\FULL\PATH\to\service-account.json"
npm run watch:push
