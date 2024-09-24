const simpleGit = require("simple-git");
const axios = require("axios");
const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const os = require("os");
const prompts = require("@inquirer/prompts");

const git = simpleGit();
const configDir = path.join(os.homedir(), ".git-commit-helper");
const configFile = path.join(configDir, "config.json");

// Function to read the configuration from a file
function readConfig() {
  if (fs.existsSync(configFile)) {
    const data = fs.readFileSync(configFile, "utf8");
    return JSON.parse(data);
  }
  return {
    profiles: [],
    activeProfile: null,
    reviewEnabled: true, // Default to enabled
  };
}

// Function to write the configuration to a file
function writeConfig(config) {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2), "utf8");
}

// Function to get the active profile
function getActiveProfile(config) {
  return config.profiles.find(
    (profile) => profile.name === config.activeProfile
  );
}

// Function to add a new profile
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

// Function to list profiles
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

// Function to set the active profile
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

// Function to switch profile interactively
async function switchProfile() {
  const config = readConfig();
  const profileName = await prompts.select({
    message: "Select a profile to activate:",
    choices: config.profiles.map((profile) => ({
      name: profile.name,
      value: profile.name,
    })),
  });
  setActiveProfile(profileName);
}

// Configure Commander to handle command-line arguments
program
  .option(
    "--set-api-key <key>",
    "Set your OpenAI API key for the active profile"
  )
  .option("--set-model <model>", "Set the OpenAI model for the active profile")
  .option(
    "--set-system-message <message>",
    "Set the OpenAI system message for the active profile"
  )
  .option("--add-profile <name>", "Add a new profile")
  .option(
    "--print-api-key",
    "Print the current OpenAI API key for the active profile"
  )
  .option(
    "--print-model",
    "Print the current OpenAI model for the active profile"
  )
  .option(
    "--print-system-message",
    "Print the current OpenAI system message for the active profile"
  )
  .option("--list-profiles", "List all profiles")
  .option("--set-active-profile <name>", "Set the active profile")
  .option("--switch-profile", "Switch profile interactively")
  .option("--enable-review", "Enable commit message review")
  .option("--disable-review", "Disable commit message review")
  .parse(process.argv);

const options = program.opts();
const config = readConfig();
const activeProfile = getActiveProfile(config);

if (options.addProfile) {
  addProfile(options.addProfile, "", "gpt-4o-mini", "");
  process.exit(0);
}

if (options.setApiKey && activeProfile) {
  activeProfile.apiKey = options.setApiKey;
  writeConfig(config);
  console.log("OpenAI API key saved successfully.");
  process.exit(0);
}

if (options.setModel && activeProfile) {
  activeProfile.model = options.setModel;
  writeConfig(config);
  console.log(`OpenAI model saved successfully: ${options.setModel}`);
  process.exit(0);
}

if (options.setSystemMessage && activeProfile) {
  activeProfile.systemMessage = options.setSystemMessage;
  writeConfig(config);
  console.log(
    `OpenAI system message saved successfully: ${options.setSystemMessage}`
  );
  process.exit(0);
}

if (options.printApiKey && activeProfile) {
  console.log(`Current OpenAI API key: ${activeProfile.apiKey || "Not set"}`);
  process.exit(0);
}

if (options.printModel && activeProfile) {
  console.log(`Current OpenAI model: ${activeProfile.model}`);
  process.exit(0);
}

if (options.printSystemMessage && activeProfile) {
  console.log(`Current OpenAI system message: ${activeProfile.systemMessage}`);
  process.exit(0);
}

if (options.listProfiles) {
  listProfiles();
  process.exit(0);
}

if (options.setActiveProfile) {
  setActiveProfile(options.setActiveProfile);
  process.exit(0);
}

if (options.switchProfile) {
  switchProfile().then(() => process.exit(0));
  return;
}

if (options.enableReview) {
  config.reviewEnabled = true;
  writeConfig(config);
  console.log("Commit message review enabled.");
  process.exit(0);
}

if (options.disableReview) {
  config.reviewEnabled = false;
  writeConfig(config);
  console.log("Commit message review disabled.");
  process.exit(0);
}

if (!activeProfile) {
  console.error(
    "Error: No active profile set. Add a profile using --add-profile <name>."
  );
  process.exit(1);
}

const OPENAI_API_KEY = activeProfile.apiKey;
const OPENAI_MODEL = activeProfile.model;
const SYSTEM_MESSAGE =
  String(activeProfile.systemMessage).length > 0
    ? activeProfile.systemMessage
    : `Objective:
To assist developers by analyzing ongoing modifications in a Git repository, identifying the changes, and generating a comprehensive and meaningful commit message.

Instructions:

1. Identify Changes:
   - Analyze the current state of the working directory and staging area in the Git repository.
   - Identify all modified, added, deleted, or renamed files.
   - For each file, determine the type of changes (e.g., added lines, removed lines, modified lines).

2. Classify Changes:
   - Categorize the changes into relevant sections such as:
     - Features: New features added.
     - Bugfixes: Bugs fixed.
     - Refactoring: Code improvements without changing functionality.
     - Documentation: Changes to comments, README files, or other documentation.
     - Testing: Additions or modifications to tests.
     - Chores: Maintenance tasks like updating dependencies.

3. Generate Commit Message:
   - Create a concise and informative commit message summarizing the changes. The commit message should follow conventional commit guidelines:
     - Header: A short summary of the changes (max 50 characters). Do not end with a period and not include the branch name.
     - Body (optional): A more detailed explanation if necessary (wrap at 72 characters).
     - Footer (optional): Any references to issues closed or other important notes. Leave empty if no issues are associated with the branch.

Output:
Provide a well-structured commit message based on the identified and classified changes. Ensure the message is clear, concise, and adheres to the repository's contribution guidelines.
Reply only with the commit message without any additional information.

Considerations:
- Ensure the commit message is self-explanatory, allowing other developers to understand the changes without having to read through the entire codebase.
- If there are multiple types of changes, ensure each type is clearly separated in the body of the commit message.
- Use imperative mood in the commit message (e.g., "fix bug" not "fixed bug").
- Be mindful of the repository's coding and commit message standards.

Example Output:
[example]
feat: implement new dashboard layout

- Added responsive design for the dashboard.
- Integrated new charting library for better data visualization.
- Updated CSS and JavaScript files to improve loading times.
- Refactored dashboard component to use hooks.
[/example]
`;

if (!OPENAI_API_KEY) {
  console.error(
    "Error: OpenAI API key is not set for the active profile. Use --set-api-key <key> to set it."
  );
  process.exit(1);
}

async function getCommitMessage(diff, branchName) {
  const prompt = `
    Write a commit message in English summarizing the following changes:
    ${diff}
    If the branch name contains an issue ID, include it in the commit message. The branch name is "${branchName}".
    Format the commit message according to git best practices.
    `;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

async function main() {
  try {
    // Step: Print model used
    console.log(`🔧 Using OpenAI model: ${OPENAI_MODEL}`);

    // Step: Add all files to the staging area
    console.log("📂 Staging all changes...");
    await git.add(".");

    // Step: Get the current Git status
    const status = await git.status();

    // Step: Get the current changes
    const diff = await git.diff(["--cached"]);

    // Step: Get the current branch name
    const branchName = status.current;

    // Step: Generate the commit message using OpenAI
    console.log("🔍 Generating commit message...");
    let commitMessage = await getCommitMessage(diff, branchName);

    // Step: Print the generated commit message
    console.log(`📝 Commit message generated:\n${commitMessage}`);

    // Step: Ask the user if they want to refine the commit message
    if (config.reviewEnabled) {
      const refine = await prompts.confirm({
        message: "Would you like to refine the commit message?",
        default: false,
      });

      if (refine) {
        const newMessage = await prompts.input({
          message: "Enter the new commit message:",
          initial: commitMessage,
          required: true,
        });
        commitMessage = newMessage;
      }
    }

    // Step: Commit the changes with the generated message
    console.log("📦 Committing changes...");
    await git.commit(commitMessage);

    // Step: Print which profile was used
    console.log(`👤 Using profile: ${activeProfile.name}`);

    // Step: Push the changes to the remote repository
    console.log("🚀 Pushing changes...");
    await git.push("origin", branchName);

    // Step: Final step
    console.log("✅ Changes committed and pushed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
