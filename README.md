# sftp sync extension for VS Code

[![Paypal Donations](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BY89QD47D7MPS&source=url) [![PayPal Me](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/liximomo)


Syncs your local directory with a remote server directory. Allows you to optionally edit upload a file to the remote directory after it saves locally.  This allows you to edit more or less directly on the server similar to WinScp or other similar programs.

Very powerful, with smart features. Very simple, requires just three lines of config! Very fast, finished in a blink.

- Features
  - [Browser remote with Remote Explorer](#remote-explorer)
  - Diff local and remote
  - Sync directory
  - Upload/Download
  - Upload on save
  - File Watcher
  - Multiple configs
  - Switchable profiles
- [Installation](#installation)
- [Building a new install file](#building-a-new-install-file)
- [Commands](https://github.com/liximomo/vscode-sftp/wiki/Command)
- [Debug](#debug)
- [Support SFTP Project](#Donation)

## About this fork

This is a fork of [liximomo/vscode-sftp](https://github.com/liximomo/vscode-sftp), published as `quietcactus.sftp`. It fixes SFTP failing with `isDate is not a function` on current VS Code and Cursor builds (Node.js 23+). It is not on the Marketplace, so it is installed from a `.vsix` file.

## Installation

1. Turn off any other SFTP extension (`liximomo.sftp`, `Natizyskunk.sftp`). In the Extensions panel, either uninstall it or click **Disable** (not **Disable (Workspace)**, which only turns it off for the current folder). Running two of them at once makes their commands conflict.
2. Get the `.vsix` file, either from someone who built it or by [building it yourself](#building-a-new-install-file).
3. Install it:
   - **VS Code / Cursor:** open the Extensions panel, click the `...` menu at the top, choose **Install from VSIX...**, and pick the file. In Cursor you can also drag the file onto the Extensions panel.
   - **Terminal:** `code --install-extension sftp-1.12.10.vsix` (use `cursor` instead of `code` for Cursor). Add `--force` to reinstall the same version.
4. Reload the window: `Ctrl+Shift+P` / `Cmd+Shift+P`, then **Developer: Reload Window**.

Existing `.vscode/sftp.json` config files keep working.

To upgrade, install a `.vsix` with a higher version the same way. It replaces the old one.

## Building a new install file

One-time setup:

1. Install [Node.js](https://nodejs.org) (LTS) and Yarn (`npm install -g yarn`).
2. Clone the repo:

   ```
   git clone https://github.com/quietcactus/vscode-sftp.git
   cd vscode-sftp
   ```

Each new build:

1. Get the latest code: `git pull`
2. Bump the version (for example 1.12.10 to 1.12.11), add an entry to `CHANGELOG.md`, then commit and push both:

   ```
   npm version patch --no-git-tag-version
   ```

3. Install dependencies and package. Webpack 4 needs the `--openssl-legacy-provider` flag on current Node.js.

   PowerShell:

   ```
   yarn install
   $env:NODE_OPTIONS="--openssl-legacy-provider"
   npx @vscode/vsce package --yarn
   ```

   Command Prompt:

   ```
   yarn install
   set NODE_OPTIONS=--openssl-legacy-provider
   npx @vscode/vsce package --yarn
   ```

   macOS / Linux:

   ```
   yarn install
   NODE_OPTIONS=--openssl-legacy-provider npx @vscode/vsce package --yarn
   ```

4. The file `sftp-<version>.vsix` is created in the repo folder. Install it as described in [Installation](#installation).

`.vsix` files are build output and are ignored by git. To share one, attach it to a GitHub Release.

## Usage
 If your latest files are on the server, you can start with an empty local folder, then download your project, and from that point sync.  


1. In `VS Code`, open a local directory you wish to sync to the remote server (or create an empty directory that you wish to first download the contents of a remote server folder in order to edit locally). 
2. `Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on Mac open command palette, run `SFTP: config` command.
3. A basic configuration file will appear named `sftp.json` under the `.vscode` directory.  Edit the parameters to match your setup.

For instance: 

```json

{
    "name": "Profile Name",
    "host": "name_of_remote_host",
    "protocol": "ftp",
    "port": 21,
    "secure": true,
    "username": "username",
    "remotePath": "/public_html/project",  <---- This is the path which will be downloaded if you "Download Project"
    "password": "password",  
    "uploadOnSave": true
}

```
The password parameter is optional but if you don't add it, you will be constantly prompted for a password.  Note that you must escape any backslashes and other special characters with a backslash.

There are other Example Configs below.

3.  Save and close the `sftp.json` file. 
4.  `Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on Mac open command palette.
5. Type "sftp" and you'll now see a number of other comands.  
6. A good one to start with if you want to start with a remote folder is `SFTP: Download Project`.  This will download the directory shown in the `remotePath` setting in `sftp.json` to your local open directory. 
7. Done  - you can now edit locally and after each save it will upload to your remote file. 
8. Enjoy !

For detailed usage. Please go to [wiki](https://github.com/liximomo/vscode-sftp/wiki).

## Example Configs

You can see the full config [here](https://github.com/liximomo/vscode-sftp/wiki/config).

- [Simple](#simple)
- [Profiles](#profiles)
- [Multiple Context](#multiple-context)
- [Connection Hopping](#connection-hopping)
  - [Single Hop](#single-hop)
  - [Multiple Hop](#multiple-hop)
- [Config in User Setting](#config-in-user-setting)

### Simple

```json
{
  "host": "host",
  "username": "username",
  "remotePath": "/remote/workspace"
}
```

### Profiles

```json
{
  "username": "username",
  "password": "password",
  "remotePath": "/remote/workspace/a",
  "watcher": {
    "files": "dist/*.{js,css}",
    "autoUpload": false,
    "autoDelete": false
  },
  "profiles": {
    "dev": {
      "host": "dev-host",
      "remotePath": "/dev",
      "uploadOnSave": true
    },
    "prod": {
      "host": "prod-host",
      "remotePath": "/prod"
    }
  },
  "defaultProfile": "dev"
}
```

_Note：_ `context` and `watcher` are only available at root level.

Use `SFTP: Set Profile` to switch profile.

### Multiple Context

The context must **not be same**.

```json
[
  {
    "name": "server1",
    "context": "project/build",
    "host": "host",
    "username": "username",
    "password": "password",
    "remotePath": "/remote/project/build"
  },
  {
    "name": "server2",
    "context": "project/src",
    "host": "host",
    "username": "username",
    "password": "password",
    "remotePath": "/remote/project/src"
  }
]
```

_Note：_ `name` is required in this mode.

### Connection Hopping

You can connect to a target server through a proxy with ssh protocol.

_Note：_ **Variable substitution is not working in a hop config.**

#### Single Hop

local -> hop -> target

```json
{
  "name": "target",
  "remotePath": "/path/in/target",
  
  // hop
  "host": "hopHost",
  "username": "hopUsername",
  "privateKeyPath": "/Users/localUser/.ssh/id_rsa", // The key file is assumed on the local.

  "hop": {
    // target
    "host": "targetHost",
    "username": "targetUsername",
    "privateKeyPath": "/Users/hopUser/.ssh/id_rsa", // The key file is assumed on the hop.
  }
}
```

#### Multiple Hop

local -> hopa -> hopb -> target

```json
{
  "name": "target",
  "remotePath": "/path/in/target",

  // hopa
  "host": "hopAHost",
  "username": "hopAUsername",
  "privateKeyPath": "/Users/hopAUsername/.ssh/id_rsa" // The key file is assumed on the local.

  "hop": [
    // hopb
    {
      "host": "hopBHost",
      "username": "hopBUsername",
      "privateKeyPath": "/Users/hopaUser/.ssh/id_rsa" // The key file is assumed on the hopa.
    },

    // target
    {
      "host": "targetHost",
      "username": "targetUsername",
      "privateKeyPath": "/Users/hopbUser/.ssh/id_rsa", // The key file is assumed on the hopb.
    }
  ]
}
```

### Config in User Setting

You can use `remote` to tell sftp to get the config from [remote-fs](https://github.com/liximomo/vscode-remote-fs).

In User Setting:

```json
"remotefs.remote": {
  "dev": {
    "scheme": "sftp",
    "host": "host",
    "username": "username",
    "rootPath": "/path/to/somewhere"
  },
  "projectX": {
    "scheme": "sftp",
    "host": "host",
    "username": "username",
    "privateKeyPath": "/Users/xx/.ssh/id_rsa",
    "rootPath": "/home/foo/some/projectx"
  }
}
```

In sftp.json:

```json
{
  "remote": "dev",
  "remotePath": "/home/xx/",
  "uploadOnSave": true,
  "ignore": [".vscode", ".git", ".DS_Store"]
}
```

## Remote Explorer

![remote-explorer-preview](https://raw.githubusercontent.com/liximomo/vscode-sftp/master/assets/showcase/remote-explorer.png)

Remote Explorer lets you explore files in remote. You can open Remote Explorer by:

1. Run Command `View: Show SFTP`.
2. Click SFTP view in Activity Bar.

You can only view a files content with Remote Explorer. Run command `SFTP: Edit in Local` to edit it in local.

_Note：_ You need to manually refresh the parent folder after you **delete** a file to make the explorer updated.

## Debug

1.  Open User Settings.

    - On Windows/Linux - `File > Preferences > Settings`
    - On macOS - `Code > Preferences > Settings`

2.  Set `sftp.debug` to `true` and reload vscode.
3.  View the logs in `View > Output > sftp`.

---

## Donation

If this project helped you reduce development time, you can give me a cup of coffee :)

### Wechat

<img width="140" alt="Wechat" src="https://raw.githubusercontent.com/liximomo/vscode-sftp/master/assets/wechat.png"/>

### Alipay

<img width="140" alt="Alipay" src="https://raw.githubusercontent.com/liximomo/vscode-sftp/master/assets/alipay.png"/>

### PayPal
[![PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BY89QD47D7MPS&source=url) [![PayPal Me](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/liximomo) 
