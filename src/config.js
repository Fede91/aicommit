const fs = require("fs");
const path = require("path");
const os = require("os");

const configDir = path.join(os.homedir(), ".git-commit-helper");
const configFile = path.join(configDir, "config.json");

function readConfig() {
  if (fs.existsSync(configFile)) {
    const data = fs.readFileSync(configFile, "utf8");
    return JSON.parse(data);
  }
  return {
    profiles: [],
    activeProfile: null,
    reviewEnabled: true,
    verbose: false,
    timeout: 60000,
    maxTokens: 150,
    temperature: 0.7,
    autoPush: true,
  };
}

function writeConfig(config) {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2), "utf8");
}

module.exports = { readConfig, writeConfig };
