import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

import { generateCommitMessage } from "./pipeline";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "commitsai" is now active!');

  // Prevent multiple commands.
  let isCommandRunning = false;

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "commitsai.generateCommitMessage",
      async () => {
        if (isCommandRunning) {
          vscode.window.showWarningMessage(
            "Commit message generation already in progress."
          );
          return;
        }

        // Set the context to show the loading spinner
        isCommandRunning = true;
        vscode.commands.executeCommand(
          "setContext",
          "commitsai.isLoading",
          true
        );

        const cfg = vscode.workspace.getConfiguration("commitsai");
        const gemini_api_key = (cfg.get("gemini_api_key") as string) || "";
        const message_size = cfg.get("message_size") || "small";
        console.log(message_size);

        let stagedDiff = "";
        let generatedCommitMessage = "";

        // Status Bar Spinner (bottom bar)
        const statusBarItem = vscode.window.createStatusBarItem(
          vscode.StatusBarAlignment.Left
        );
        statusBarItem.text = "$(sync~spin) Generating commit message...";
        statusBarItem.show();

        try {
          const gitExtension = vscode.extensions.getExtension("vscode.git");
          if (!gitExtension) {
            vscode.window.showErrorMessage("Git extension is not available.");
            return;
          }

          const gitApi = gitExtension.exports.getAPI(1);
          const repo = gitApi.repositories[0];
          if (!repo) {
            vscode.window.showErrorMessage("No active Git repository found.");
            return;
          }

          const repoPath = repo.rootUri.fsPath;

          // Add yellow pulse progress bar
          await vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.SourceControl,
              title: "Generating commit message...",
              cancellable: false,
            },
            async () => {
              // Get staged differences
              const { stdout, stderr } = await execAsync(`git diff --cached`, {
                cwd: repoPath,
              });

              if (stderr) {
                throw new Error(stderr);
              }

              stagedDiff = stdout;

              // Generate the commit message
              generatedCommitMessage = await generateCommitMessage(
                stagedDiff,
                gemini_api_key
              );

              // Set the commit message in the Source Control input box
              repo.inputBox.value = generatedCommitMessage.trim();
            }
          );
        } catch (error) {
          console.error("Error: ", error);
          vscode.window.showErrorMessage("Failed to generate commit message.");
        } finally {
          isCommandRunning = false;
          vscode.commands.executeCommand(
            "setContext",
            "commitsai.isLoading",
            false
          );
          statusBarItem.hide();
        }
      }
    )
  );
}
