const vscode = require("vscode");

const TS_LANGUAGES = new Set([
  "typescript",
  "typescriptreact",
  "javascript",
  "javascriptreact",
]);
const EXCLUDE_GLOB = "**/{node_modules,.next,dist,build,out,coverage}/**";

const activate = async (context) => {
  const folder = vscode.workspace.workspaceFolders?.[0];
  if (!folder) {
    return;
  }

  const uri = await findStartFile(folder);
  if (!uri) {
    return;
  }

  // The TS extensions start only when a JS or TS document opens. We open the
  // document without an editor, so no tab appears.
  await openHidden(uri);

  // VS Code closes documents that have no editor after some minutes. Then the
  // TS server can unload the project. Open the document again if no other
  // TS document is open.
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      if (document.uri.toString() !== uri.toString()) {
        return;
      }
      if (hasOpenTsDocument()) {
        return;
      }
      openHidden(uri);
    }),
  );
};

const deactivate = () => {};

module.exports = { activate, deactivate };

const findStartFile = async (folder) => {
  const configuredPath = vscode.workspace
    .getConfiguration("tsserverAutostart", folder.uri)
    .get("file");
  if (configuredPath) {
    return vscode.Uri.joinPath(folder.uri, configuredPath);
  }

  // A file in the root folder is almost always in the root tsconfig. A file in
  // a subfolder can be in a different tsconfig.
  for (const pattern of ["*.{ts,tsx}", "**/*.{ts,tsx}"]) {
    const [uri] = await vscode.workspace.findFiles(
      new vscode.RelativePattern(folder, pattern),
      EXCLUDE_GLOB,
      1,
    );
    if (uri) {
      return uri;
    }
  }
  return undefined;
};

const openHidden = async (uri) => {
  try {
    await vscode.workspace.openTextDocument(uri);
  } catch (error) {
    console.error(`[tsserver-autostart] Cannot open ${uri.fsPath}`, error);
  }
};

const hasOpenTsDocument = () =>
  vscode.workspace.textDocuments.some(
    (document) => !document.isClosed && TS_LANGUAGES.has(document.languageId),
  );
