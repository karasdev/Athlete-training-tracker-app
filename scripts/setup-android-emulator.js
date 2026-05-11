const { spawnSync } = require("child_process");

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: "pipe",
  });

  return {
    ok: result.status === 0,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim(),
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
