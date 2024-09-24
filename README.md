# aicommit

[![NPM Version](https://img.shields.io/npm/v/aicommit)](https://www.npmjs.com/package/aicommit)
[![License](https://img.shields.io/npm/l/aicommit)](https://github.com/yourusername/aicommit/blob/main/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/aicommit/ci.yml)](https://github.com/yourusername/aicommit/actions)

`aicommit` is a tool that generates git commit messages using OpenAI's GPT models. It supports multiple profiles, enabling different configurations for API keys, models, and system messages.

## Features

- **Generate Commit Messages**: Automatically generate commit messages using OpenAI's GPT models.
- **Multiple Profiles**: Manage multiple profiles, each with its own API key, model, and system message.
- **Interactive Message Review**: Option to review and refine the commit message before committing.
- **Profile Management**: Commands to add, list, and switch profiles.

## Installation

To install `aicommit`, use npm:

```sh
npm install -g aicommit
```

## Usage

### Adding and Managing Profiles

#### Add a New Profile

```sh
aicommit --add-profile <name>
```

#### List All Profiles

```sh
aicommit --list-profiles
```

#### Set the Active Profile

```sh
aicommit --set-active-profile <name>
```

#### Switch Profile Interactively

```sh
aicommit --switch-profile
```

### Configuring Profiles

#### Set OpenAI API Key

```sh
aicommit --set-api-key YOUR_OPENAI_API_KEY
```

#### Set OpenAI Model

```sh
aicommit --set-model YOUR_CHOSEN_MODEL
```

#### Set OpenAI System Message

```sh
aicommit --set-system-message "Your custom system message"
```

#### Enable Commit Message Review

```sh
aicommit --enable-review
```

#### Disable Commit Message Review

```sh
aicommit --disable-review
```

### Printing Profile Information

#### Print Current OpenAI API Key

```sh
aicommit --print-api-key
```

#### Print Current OpenAI Model

```sh
aicommit --print-model
```

#### Print Current OpenAI System Message

```sh
aicommit --print-system-message
```

### Committing Changes

Simply run the command without any options to stage, generate a commit message, review (if enabled), commit, and push the changes.

```sh
aicommit
```

## Example Workflow

1. **Add a Profile**:

   ```sh
   aicommit --add-profile myprofile
   ```

2. **Set API Key**:

   ```sh
   aicommit --set-api-key YOUR_OPENAI_API_KEY
   ```

3. **Set Model**:

   ```sh
   aicommit --set-model gpt-4o-mini
   ```

4. **Set System Message**:

   ```sh
   aicommit --set-system-message "You are a helpful assistant."
   ```

5. **Enable/Disable Review**:

   ```sh
   aicommit --enable-review
   ```

6. **Generate and Commit Changes**:

   ```sh
   aicommit
   ```

## Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, feel free to open an issue on [GitHub](https://github.com/yourusername/aicommit/issues).

## Acknowledgments

- [OpenAI](https://www.openai.com) for providing the API.
- [simple-git](https://github.com/steveukx/git-js) for making Git integration easy.
- [commander](https://github.com/tj/commander.js) for command-line argument parsing.
- [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/prompts) for the interactive prompts.
