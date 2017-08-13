'use strict';
import * as vscode from 'vscode';
// import { TextDocument, Position, CancellationToken, CompletionItem, languages } from 'vscode';

const languageConfiguration: vscode.LanguageConfiguration = {
  wordPattern: /(\w+((-\w+)+)?)/
}

export function activate(context: vscode.ExtensionContext) {
  vscode

  const configParams = vscode.workspace.getConfiguration('vue-peek');
  const supportedLanguages = configParams.get('supportedLanguages') as Array<string>;
  const targetFileExtensions = configParams.get('targetFileExtensions') as Array<string>;

  context.subscriptions.push(vscode.languages.registerDefinitionProvider(
    supportedLanguages,
    new PeekFileDefinitionProvider(targetFileExtensions)
  ));

  context.subscriptions.push(vscode.languages.setLanguageConfiguration(
    'vue',
    languageConfiguration)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class PeekFileDefinitionProvider implements vscode.DefinitionProvider {
  protected targetFileExtensions: string[] = [];

  constructor(targetFileExtensions: string[] = []) {
    this.targetFileExtensions = targetFileExtensions;
  }

  getComponentName(position: vscode.Position): String[] {
    const doc = vscode.window.activeTextEditor.document;
    const selection = doc.getWordRangeAtPosition(position);
    const selectedText = doc.getText(selection);
    let possibleFileNames = [],
      altName = ''

    selectedText.match(/\w+/g).forEach(str => {
      return altName += str[0].toUpperCase() + str.substring(1);
    })

    possibleFileNames.push(altName, selectedText);

    return possibleFileNames;
  }

  searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}.vue`, '**/node_modules'); // Returns promise
    // 
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
    const componentNames = this.getComponentName(position);
    const searchPathActions = componentNames.map(this.searchFilePath);
    const searchPromises = Promise.all(searchPathActions); // pass array of promises
    let possiblePaths = [];
    searchPromises.then(paths => {
      possiblePaths = [].concat.apply([], paths);
      if (possiblePaths.length) {
        return possiblePaths;
        // return new vscode.Location(vscode.Uri.file(filePath),new vscode.Position(0,1) );
      } else {
        return undefined;
      }
    });
  }
}