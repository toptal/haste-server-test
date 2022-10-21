## Linting

### Editor setup

#### VS Code

1. Install `eslint` add-on for VSCode. [VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
1. `⇧ ⌘ P`, or for linux `ctrl ⇧ P` - open command pallete
1. `Preferences: Open Settings (JSON)` or `Preferences: Open Workspace Settings (JSON)`
1. Add the following to enable fixing auto fixable problems on file save:

```json
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
```

### Javascript and Typescript

You can lint the code (js,jsx,ts,tsx) with:

```bash
yarn lint
```

You can fix the errors with:

```bash
yarn lint:fix
```

To be able to fun this commands in a specific project:

```bash 
yarn lint --scope='project-name'
yarn lint:fix --scope='project-name'
```

### Styles

You can lint the code (scss,css) with:

```bash
yarn lint:styles
```

You can fix the errors with:

```bash
yarn lint:styles:fix
```

It will run the commands on next-app and UI packages.

To be able to fun this commands in a specific project:

```bash 
yarn lint:styles --scope='project-name'
yarn lint:styles:fix --scope='project-name'
```