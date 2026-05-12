const { spawn, spawnSync } = require("child_process");
const path = require("path");

const androidHome =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  (process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Android", "Sdk")
    : undefined);

const env = { ...process.env };
const pathKey =
  Object.keys(env).find((key) => key.toLowerCase() === "path") || "Path";

if (androidHome) {
  env.ANDROID_HOME = androidHome;
  env.ANDROID_SDK_ROOT = androidHome;
  env[pathKey] = [
    path.join(androidHome, "platform-tools"),
    path.join(androidHome, "emulator"),
    env[pathKey] || "",
  ].join(path.delimiter);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    env,
    stdio: "pipe",
  });

  return {
    ok: result.status === 0,
    output: `${result.stdout || ""}${result.stderr || ""}${result.error || ""}`.trim(),
  };
}

const devices = run("adb", ["devices"]);

if (!devices.ok || !devices.output.includes("device")) {
  console.warn("No Android emulator/device found. Start the emulator first.");
} else {
  for (const port of ["8081", "8080"]) {
    const reverse = run("adb", ["reverse", `tcp:${port}`, `tcp:${port}`]);

    if (!reverse.ok && reverse.output) {
      console.warn(reverse.output);
    }
  }
}

const expoArgs = ["expo", "start", "--dev-client", "--android", "--localhost"];

if (process.argv.includes("--clear") || process.argv.includes("-c")) {
  expoArgs.push("--clear");
}

const expoCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const command =
  process.platform === "win32"
    ? process.env.ComSpec ||
      path.join(process.env.SystemRoot || "C:\\Windows", "System32", "cmd.exe")
    : expoCommand;
const args =
  process.platform === "win32"
    ? ["/d", "/s", "/c", [expoCommand, ...expoArgs].join(" ")]
    : expoArgs;

const expo = spawn(command, args, {
  env,
  stdio: "inherit",
});

expo.on("exit", (code, signal) => {
  if (typeof code === "number") {
    process.exit(code);
  }

  process.exit(signal ? 1 : 0);
});
