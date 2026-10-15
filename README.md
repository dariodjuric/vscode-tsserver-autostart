# TS Server Autostart

VS Code starts the TypeScript server only when you open a JS or TS file. Until then, workspace symbol search (`#` in Quick Open) finds nothing.

This extension activates when the workspace has a `tsconfig.json` or `jsconfig.json`. It opens one TypeScript file without an editor, so the TypeScript server starts at once. No tab opens. It works with the built-in TypeScript extension and with TypeScript Native Preview (tsgo).

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `tsserverAutostart.file` | `""` | Path of the file to open, relative to the workspace folder. If it is empty, the extension uses the first `.ts` or `.tsx` file in the root folder, then in subfolders. |

## Limits

- In a multi-root workspace, the extension uses only the first folder.
- The extension does not search in `node_modules`, `.next`, `dist`, `build`, `out` and `coverage`.

## Build

```bash
./make-release.sh 0.0.1
code --install-extension tsserver-autostart-0.0.1.vsix
```
