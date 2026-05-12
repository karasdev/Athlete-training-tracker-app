const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const androidDir = path.join(root, "android");
const isDebug = process.argv.includes("--debug");
const noMirror = process.argv.includes("--no-mirror");
const gradleTask = isDebug ? "app:assembleDebug" : "app:assembleRelease";
const shortRoot = "C:\\att-build";
const apkPath = path.join(
  androidDir,
  "app",
  "build",
  "outputs",
  "apk",
  isDebug ? "debug" : "release",
  isDebug ? "app-debug.apk" : "app-release.apk",
);

const env = { ...process.env };
const pathKey =
  Object.keys(env).find((key) => key.toLowerCase() === "path") || "Path";
env.NODE_ENV = env.NODE_ENV || (isDebug ? "development" : "production");

const javaCandidates = [
  env.JAVA_HOME,
  env.ProgramFiles
    ? path.join(env.ProgramFiles, "Android", "Android Studio", "jbr")
    : undefined,
  "C:\\Program Files\\Android\\Android Studio\\jbr",
].filter(Boolean);

const javaHome = javaCandidates.find((candidate) =>
  fs.existsSync(path.join(candidate, "bin", "java.exe")),
);

if (javaHome) {
  env.JAVA_HOME = javaHome;
  env[pathKey] = [path.join(javaHome, "bin"), env[pathKey] || ""].join(
    path.delimiter,
  );
} else {
  console.warn(
    "Java 21 was not found automatically. Install Android Studio or set JAVA_HOME before building.",
  );
}

const androidHome =
  env.ANDROID_HOME ||
  env.ANDROID_SDK_ROOT ||
  (env.LOCALAPPDATA ? path.join(env.LOCALAPPDATA, "Android", "Sdk") : "");

if (androidHome) {
  env.ANDROID_HOME = androidHome;
  env.ANDROID_SDK_ROOT = androidHome;
  env[pathKey] = [
    path.join(androidHome, "platform-tools"),
    path.join(androidHome, "emulator"),
    env[pathKey] || "",
  ].join(path.delimiter);
}

function run(command, args, cwd) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function runRobocopy(source, destination) {
  const resolvedDestination = path.resolve(destination);

  if (resolvedDestination.toLowerCase() !== shortRoot.toLowerCase()) {
    throw new Error(`Refusing to mirror into unexpected path: ${destination}`);
  }

  fs.mkdirSync(resolvedDestination, { recursive: true });

  console.log(`\n> robocopy ${source} ${destination}`);
  const result = spawnSync(
    "robocopy.exe",
    [
      source,
      destination,
      "/MIR",
      "/R:2",
      "/W:1",
      "/XD",
      path.join(source, ".git"),
      path.join(source, ".expo"),
      path.join(source, "android", ".gradle"),
      path.join(source, "android", "build"),
      path.join(source, "android", "app", "build"),
    ],
    {
      env,
      stdio: "inherit",
    },
  );

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if ((result.status || 0) > 7) {
    process.exit(result.status || 1);
  }
}

if (process.platform === "win32" && !noMirror && root.toLowerCase() !== shortRoot.toLowerCase()) {
  runRobocopy(root, shortRoot);

  run(
    process.execPath,
    [
      path.join(shortRoot, "scripts", "build-android-apk.js"),
      isDebug ? "--debug" : "--release",
      "--no-mirror",
    ],
    shortRoot,
  );

  const builtApk = path.join(
    shortRoot,
    "android",
    "app",
    "build",
    "outputs",
    "apk",
    isDebug ? "debug" : "release",
    isDebug ? "app-debug.apk" : "app-release.apk",
  );
  const distDir = path.join(root, "dist");
  const distApk = path.join(
    distDir,
    isDebug
      ? "athlete-training-tracker-debug.apk"
      : "athlete-training-tracker-release.apk",
  );

  fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(builtApk, distApk);
  console.log(`\nAPK copied to: ${distApk}`);
  process.exit(0);
}

run(process.execPath, [
  path.join(root, "node_modules", "expo", "bin", "cli"),
  "prebuild",
  "--platform",
  "android",
  "--no-install",
], root);

const javaCommand =
  javaHome && process.platform === "win32"
    ? path.join(javaHome, "bin", "java.exe")
    : "java";

run(javaCommand, [
  "-classpath",
  path.join("gradle", "wrapper", "gradle-wrapper.jar"),
  "org.gradle.wrapper.GradleWrapperMain",
  gradleTask,
], androidDir);

console.log(`\nAPK created: ${apkPath}`);
