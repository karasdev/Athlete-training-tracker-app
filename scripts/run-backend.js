const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const backendDir = path.join(root, "backend");
const env = {
  ...process.env,
  DB_URL:
    process.env.DB_URL || "jdbc:postgresql://127.0.0.1:5432/athlete_training",
  DB_USERNAME: process.env.DB_USERNAME || "karasdev",
  DB_PASSWORD: process.env.DB_PASSWORD || "123123",
};

const candidates =
  process.platform === "win32"
    ? [
        path.join(
          process.env.ProgramFiles || "C:\\Program Files",
          "Apache",
          "mvn",
          "bin",
          "mvn.cmd",
        ),
        path.join(
          process.env.ProgramFiles || "C:\\Program Files",
          "Apache",
          "bin",
          "mvn.cmd",
        ),
        "mvn.cmd",
      ]
    : ["mvn"];

const mvn = candidates.find((candidate) => {
  if (candidate.includes(path.sep)) {
    return fs.existsSync(candidate);
  }

  return true;
});

const mvnArgs = process.argv.length > 2 ? process.argv.slice(2) : ["spring-boot:run"];

function quote(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

const command = process.platform === "win32"
  ? path.join(env.SystemRoot || "C:\\Windows", "System32", "cmd.exe")
  : mvn;
const args = process.platform === "win32"
  ? ["/d", "/c", ["call", quote(mvn), ...mvnArgs.map(quote)].join(" ")]
  : mvnArgs;

const child = spawn(command, args, {
  cwd: backendDir,
  env,
  stdio: "inherit",
  shell: false,
  windowsVerbatimArguments: process.platform === "win32",
});

child.on("error", (error) => {
  console.error(error.message);
  console.error(
    "Maven was not found. Install Maven or add Maven's bin folder to PATH.",
  );
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (typeof code === "number") {
    process.exit(code);
  }

  process.exit(signal ? 1 : 0);
});
