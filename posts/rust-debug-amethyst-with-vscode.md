# How to debug an Amethyst game with VSCode

First you want to install vscode [lldb](https://github.com/vadimcn/vscode-lldb) extension.
Then create `.vscode/launch.json` with followin contents.

```json

{
    "version": "0.2.0",
    "configurations": [
        {
			"type": "lldb",
			"request": "launch",
			"name": "Debug executable 'ltet'",
			"cargo": {
				"args": [
					"build",
					"--bin=ltet",
					"--package=ltet"
				],
				"filter": {
					"name": "ltet",
					"kind": "bin"
				}
			},
			"args": [],
			"env": {
				"CARGO_MANIFEST_DIR":""
			},
			"cwd": "${workspaceFolder}"
		}
    ]
}

```

The `ltet` is my project name. Set `CARGO_MANIFEST_DIR` to an empty string. Other wise you will getting an error like following.

```
Error: Error { inner: Inner { source: None, backtrace: None, error: File(Os { code: 2, kind: NotFound, message: "No such file or directory" }) } }
```

Because your application is checking for assets on the `target/rls/debug` folder.



