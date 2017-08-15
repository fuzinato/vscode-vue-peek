'use strict';
import * as vscode from 'vscode';
import PeekFileDefinitionProvider from './PeekFileDefinitionProvider'

const languageConfiguration: vscode.LanguageConfiguration = {
  wordPattern: /(\w+((-\w+)+)?)/
}

export function activate(context: vscode.ExtensionContext) {

  const configParams = vscode.workspace.getConfiguration('vue-peek');
  const supportedLanguages = configParams.get('supportedLanguages') as Array<string>;
  const targetFileExtensions = configParams.get('targetFileExtensions') as Array<string>;
  
  context.subscriptions.push(vscode.languages.registerDefinitionProvider(
    supportedLanguages,
    new PeekFileDefinitionProvider(targetFileExtensions)
  ));

  /* Provides way to get selected text even if there is dash
   * ( must have fot retrieving component name )
   */
  context.subscriptions.push(vscode.languages.setLanguageConfiguration(
    'vue',
    languageConfiguration)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
}
