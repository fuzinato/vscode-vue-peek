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
  }

  preparePaths(asd) {
    
  }

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken): vscode.Definition[] | any {
    let filePaths = [];
    const componentNames = this.getComponentName(position);
    const searchPathActions = componentNames.map(this.searchFilePath);
    const searchPromises = Promise.all(searchPathActions); // pass array of promises
      let all = [];
      all.push(new vscode.Location(vscode.Uri.file('/home/duri/projects/tips2/src/pages/Home.vue'),new vscode.Position(0,1) ))
      all.push(new vscode.Location(vscode.Uri.file('home/duri/projects/tips2/src/blocks/na/sdf/Home.vue'),new vscode.Position(0,1) ))
    return all;
    /* searchPromises.then(paths => {
      filePaths = [].concat.apply([], paths);
      
      if (filePaths.length) {
        // return new vscode.Location(vscode.Uri.file(filePaths[0].path), new vscode.Position(0,1) );
        filePaths.forEach(filePath => {
          console.log(filePath.path)
          return new vscode.Location(vscode.Uri.file('/home/duri/projects/tips2/src/pages/Home.vue'),new vscode.Position(0,1) );
        })
      }
      return undefined;
    }, (reason) => {
      
      return undefined;
    }); */
  }
}
