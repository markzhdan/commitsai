# CommitsAI README

CommitsAI is an AI-powered extension for VS Code that generates commit messages based on the differences in your staged changes. Using Google's Gemini AI, it ensures your commit messages follow a conventional structure while saving time and effort.

---

## Features

- **AI-Generated Commit Messages**: Automatically generate meaningful commit messages by analyzing your staged changes.
  - Follows [Convential Commits](https://www.conventionalcommits.org/en/v1.0.0/) standards
- **Configurable Message Size**: Choose from small, medium, or large commit message styles.
- **Seamless Integration**: Works directly with the VS Code Source Control view.

### Screenshots

#### Generate Commit Message:

![Generate Commit Message](/showcase.png)

---

## Requirements

To use CommitsAI, ensure you have the following:

1. **Git**:

   - Make sure Git is installed and configured on your system.
   - The extension uses `git diff --cached` to retrieve staged changes.

2. **Google Gemini API Key**:
   - Obtain an API key from [Google Cloud](https://cloud.google.com/ai) to use Gemini AI.
   - Add the key to the extension's settings (`commitsai.gemini_api_key`).

---

## Extension Settings

CommitsAI contributes the following settings:

- **`commitsai.gemini_api_key`**:

  - Your Google Gemini API key. This is required for generating commit messages.
  - Example: `"AIzaSyD...your-api-key"`

- **`commitsai.message_size`**:
  - Defines the style and size of generated commit messages.
  - Options:
    - `small`
    - `medium`
    - `large`
  - Default: `small`.

### Configuration Example

```json
"commitsai.gemini_api_key": "YOUR_API_KEY_HERE",
"commitsai.message_size": "medium"
```

## Known Issues

- API key isn't validated. Ensure key is set to avoid errors.
- Sometimes request halts.
  - Cancel button coming soon.

## Release Notes

### 0.0.1

Initial release of CommitsAI

Added feature AI-generated commit messages based on staged changes.

---

**Enjoy using CommitsAI!**
