const { spawnSync } = require("child_process");
const path = require("path");

const androidHome =
  process.env.ANDROID_HOME ||
  process.env.ANDROID_SDK_ROOT ||
  (process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Android", "Sdk")
    : undefined);

if (androidHome) {
  process.env.ANDROID_HOME = androidHome;
  process.env.ANDROID_SDK_ROOT = androidHome;
  process.env.PATH = [
    path.join(androidHome, "platform-tools"),
    path.join(androidHome, "emulator"),
    process.env.PATH || "",
  ].join(path.delimiter);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
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
  process.exit(0);
}

for (const port of ["8081", "8080"]) {
  const reverse = run("adb", ["reverse", `tcp:${port}`, `tcp:${port}`]);
  if (!reverse.ok && reverse.output) {
    console.warn(reverse.output);
  }
}
