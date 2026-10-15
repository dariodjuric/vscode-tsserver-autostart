const fs = require("fs");
const vscode = require("vscode");

const run = async () => {
  const start = Date.now();
  let symbols = [];
  while (Date.now() - start < 90000) {
    symbols = await vscode.commands.executeCommand(
      "vscode.executeWorkspaceSymbolProvider",
      "muse",
    );
    if (symbols.length > 0) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const result = {
    seconds: (Date.now() - start) / 1000,
    count: symbols.length,
    sample: symbols.slice(0, 3).map((s) => s.name),
    openDocuments: vscode.workspace.textDocuments.map((d) => d.uri.fsPath),
    visibleEditors: vscode.window.visibleTextEditors.length,
  };
  fs.writeFileSync(process.env.RESULT_FILE, JSON.stringify(result, null, 2));
};

module.exports = { run };
