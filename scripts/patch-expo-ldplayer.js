const fs = require("fs");
const path = require("path");

const adbFile = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo",
  "node_modules",
  "@expo",
  "cli",
  "build",
  "src",
  "start",
  "platforms",
  "android",
  "adb.js"
);

const original = `        } else {
            // Given an emulator pid, get the emulator name which can be used to start the emulator later.
            name = await getAdbNameForDeviceIdAsync({
                pid
            }) ?? '';
        }`;

const patched = `        } else {
            // LDPlayer reports as emulator-5554 but does not support the Google emulator console.
            try {
                name = await getAdbNameForDeviceIdAsync({
                    pid
                }) ?? '';
            } catch (error) {
                if (!String(error?.message ?? error).includes('could not connect to TCP port')) {
                    throw error;
                }
                name = pid;
            }
        }`;

if (!fs.existsSync(adbFile)) {
  process.exit(0);
}

const content = fs.readFileSync(adbFile, "utf8");

if (content.includes(patched)) {
  process.exit(0);
}

if (!content.includes(original)) {
  console.warn("Expo LDPlayer patch was not applied: target code changed.");
  process.exit(0);
}

fs.writeFileSync(adbFile, content.replace(original, patched));
