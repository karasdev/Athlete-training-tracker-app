const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const shortRoot = "C:\\att-build";
const noMirror = process.argv.includes("--no-mirror");
const env = { ...process.env };
const pathKey =
  Object.keys(env).find((key) => key.toLowerCase() === "path") || "Path";

const javaHomeCandidates = [
  env.JAVA_HOME,
  env.ProgramFiles
    ? path.join(env.ProgramFiles, "Android", "Android Studio", "jbr")
    : undefined,
  "C:\\Program Files\\Android\\Android Studio\\jbr",
].filter(Boolean);

const javaHome = javaHomeCandidates.find((candidate) =>
  fs.existsSync(path.join(candidate, "bin", "java.exe")),
);

if (javaHome) {
  env.JAVA_HOME = javaHome;
  env[pathKey] = [path.join(javaHome, "bin"), env[pathKey] || ""].join(
    path.delimiter,
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

function runRobocopy(source, destination) {
  const resolvedDestination = path.resolve(destination);

  if (resolvedDestination.toLowerCase() !== shortRoot.toLowerCase()) {
    throw new Error(`Refusing to mirror into unexpected path: ${destination}`);
  }

  fs.mkdirSync(resolvedDestination, { recursive: true });

  const result = spawn(
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

  result.on("error", (error) => {
    console.error(error.message);
    process.exit(1);
  });

  result.on("exit", (code) => {
    if ((code || 0) > 7) {
      process.exit(code || 1);
    }

    installFrom(shortRoot);
  });
}

function installFrom(projectRoot) {
  const cli = path.join(projectRoot, "node_modules", "expo", "bin", "cli");
  const child = spawn(process.execPath, [cli, "run:android"], {
    cwd: projectRoot,
    env,
    stdio: "inherit",
  });

  child.on("error", (error) => {
    console.error(error.message);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (typeof code === "number") {
      process.exit(code);
    }

    process.exit(signal ? 1 : 0);
  });
}

if (process.platform === "win32" && !noMirror && root.toLowerCase() !== shortRoot.toLowerCase()) {
  runRobocopy(root, shortRoot);
} else {
  installFrom(root);
}
