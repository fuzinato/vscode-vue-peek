'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vue-peek" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World!');
  });

  const configParams         = vscode.workspace.getConfiguration('vue-peek');
  const supportedLanguages   = configParams.get('supportedLanguages') as Array<string>;
  const targetFileExtensions = configParams.get('targetFileExtensions') as Array<string>;

  // let fileSelectors:vscode.DocumentSelectors[] =

  const vuePeekDisposable   = vscode.languages.registerDefinitionProvider(supportedLanguages, new PeekFileDefinitionProvider(targetFileExtensions))

  context.subscriptions.push(vuePeekDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class PeekFileDefinitionProvider implements vscode.DefinitionProvider {
  protected targetFileExtensions: string[] = [];

  constructor (targetFileExtensions: string[] = []) {
    this.targetFileExtensions = targetFileExtensions;
    console.log(this)
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<null> {
    console.log(document)
    console.log(position)
    console.log(token)
    return null;
  }
}