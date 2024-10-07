const { readConfig, writeConfig } = require("./config");

function getActiveProfile(config) {
  return config.profiles.find(
    (profile) => profile.name === config.activeProfile
  );
}

function addProfile(name, apiKey, model, systemMessage) {
  const config = readConfig();
  const profile = { name, apiKey, model, systemMessage };
  config.profiles.push(profile);
  if (config.profiles.length === 1) {
    config.activeProfile = name;
  }
  writeConfig(config);
  console.log(`Profile "${name}" added successfully.`);
}

function listProfiles() {
  const config = readConfig();
  console.log("Profiles:");
  config.profiles.forEach((profile) => {
    console.log(
      `- ${profile.name}${
        profile.name === config.activeProfile ? " (active)" : ""
      }`
    );
  });
}

function setActiveProfile(name) {
  const config = readConfig();
  if (config.profiles.find((profile) => profile.name === name)) {
    config.activeProfile = name;
    writeConfig(config);
    console.log(`Active profile set to "${name}".`);
  } else {
    console.log(`Profile "${name}" not found.`);
  }
}

module.exports = {
  getActiveProfile,
  addProfile,
  listProfiles,
  setActiveProfile,
};
