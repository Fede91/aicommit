const { program } = require("commander");

function setupCLI() {
  program
    .option(
      "--set-api-key <key>",
      "Set your OpenAI API key for the active profile"
    )
    .option(
      "--set-model <model>",
      "Set the OpenAI model for the active profile"
    )
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
    .option("--verbose", "Enable verbose output for git operations")
    .option("--set-verbose <value>", "Set verbose mode (1 for on, 0 for off)")
    .option("--set-timeout <value>", "Set API request timeout in milliseconds")
    .option(
      "--set-max-tokens <value>",
      "Set maximum number of tokens for the response"
    )
    .option(
      "--set-temperature <value>",
      "Set temperature for the LLM model (0.0 to 1.0)"
    )
    .option("--set-auto-push <value>", "Set auto push (1 for on, 0 for off)")
    .option("--np", "Disable auto-push for this session only")
    .parse(process.argv);

  return program.opts();
}

module.exports = { setupCLI };
