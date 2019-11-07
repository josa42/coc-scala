# coc-scala

Scala language server extension using [`Metals`](https://scalameta.org/metals/)
for [`coc.nvim`](https://github.com/neoclide/coc.nvim).

## Install

In your vim/neovim, run command:

```
:CocInstall coc-scala
```

## Features

See [`Metals`](https://scalameta.org/metals/)

## Configuration options

- `sh.enable` set to `false` to disable language server.
- `sh.binaryPath` Optinal Absolute path to `metals-vim`.

Trigger completion in `coc-settings.json` to get complete list.

## Development

1. Run `yarn build` or `yarn build:watch`
2. Link extension

```sh
cd ~/github/coc-scala          && yarn link
cd ~/.config/coc/extensions && yarn link coc-scala
```

3. Add `"coc-scala": "*"` to dependencies in `~/.config/coc/extensions/package.json`

## License

[MIT © Josa Gesell](LICENSE)
