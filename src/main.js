const prompts = require("@inquirer/prompts");
const { readConfig, writeConfig } = require("./config");
const { getActiveProfile } = require("./profiles");
const {
  stageChanges,
  getStatus,
  getDiff,
  commitChanges,
  pushChanges,
} = require("./git");
const { getCommitMessage } = require("./openai");
const { setupCLI } = require("./cli");

async function main() {
  const options = setupCLI();
  const config = readConfig();
  const activeProfile = getActiveProfile(config);

  // Handle all the CLI options here (similar to the original index.js)
  // ...

  if (!activeProfile) {
    console.error(
      "Error: No active profile set. Add a profile using --add-profile <name>."
    );
    process.exit(1);
  }

  const OPENAI_API_KEY = activeProfile.apiKey;
  const OPENAI_MODEL = activeProfile.model;
  const SYSTEM_MESSAGE =
    activeProfile.systemMessage || "Default system message";

  if (!OPENAI_API_KEY) {
    console.error(
      "Error: OpenAI API key is not set for the active profile. Use --set-api-key <key> to set it."
    );
    process.exit(1);
  }

  try {
    const verbose = config.verbose;
    const noPush = options.np;

    // Step: Print model used
    console.log(`🔧 Using OpenAI model: ${OPENAI_MODEL}`);

    // Step: Add all files to the staging area
    console.log("📂 Staging all changes...");
    await stageChanges(verbose);

    // Step: Get the current Git status
    const status = await getStatus();

    // Check if there are any files in the staging area
    if (status.staged.length === 0) {
      console.log("No changes to commit. Exiting.");
      process.exit(0);
    }

    // Step: Get the current changes
    const diff = await getDiff();

    // Step: Get the current branch name
    const branchName = status.current;

    // Step: Generate the commit message using OpenAI
    console.log("🔍 Generating commit message...");
    let commitMessage = await getCommitMessage(
      diff,
      branchName,
      OPENAI_API_KEY,
      OPENAI_MODEL,
      SYSTEM_MESSAGE,
      config.maxTokens,
      config.temperature,
      config.timeout
    );

    // Step: Print the generated commit message
    console.log(`📝 Commit message generated:\n${commitMessage}`);

    // Step: Ask the user if they want to refine or regenerate the commit message
    if (config.reviewEnabled) {
      let continueReview = true;
      while (continueReview) {
        const action = await prompts.select({
          message: "What would you like to do with this commit message?",
          choices: [
            { name: "Use as is", value: "use" },
            { name: "Refine", value: "refine" },
            { name: "Generate another", value: "regenerate" },
          ],
        });

        switch (action) {
          case "use":
            continueReview = false;
            break;
          case "refine":
            const newMessage = await prompts.input({
              message: "Enter the refined commit message:",
              initial: commitMessage,
              required: true,
            });
            commitMessage = newMessage;
            continueReview = false;
            break;
          case "regenerate":
            console.log("🔄 Regenerating commit message...");
            commitMessage = await getCommitMessage(diff, branchName);
            console.log(`📝 New commit message generated:\n${commitMessage}`);
            break;
        }
      }
    }

    // Step: Commit the changes with the generated message
    console.log("📦 Committing changes...");
    await commitChanges(commitMessage, verbose);

    // Step: Print which profile was used
    console.log(`👤 Using profile: ${activeProfile.name}`);

    // Step: Push the changes to the remote repository if autoPush is enabled and --no-push is not set
    if (config.autoPush && !noPush) {
      console.log("🚀 Pushing changes...");
      await pushChanges(branchName, verbose);
      console.log("✅ Changes committed and pushed successfully!");
    } else {
      console.log("✅ Changes committed successfully! (Push skipped)");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

module.exports = { main };
