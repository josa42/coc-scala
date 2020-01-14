import path from 'path'
import fs from 'fs'
import pkgDir from 'pkg-dir'
import { TransportKind, ExtensionContext, LanguageClient, ServerOptions, commands, workspace, services, LanguageClientOptions, extensions } from 'coc.nvim'

interface ScalaConfig {
  enable: boolean
  keepUsing: boolean
  binaryPath: string
}

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration().get('scala', {}) as ScalaConfig
  if (config.enable === false) {
    return
  }

  if (config.keepUsing !== true) {
    const choice = await workspace.showQuickpick([
      "Replace coc-scala with the official coc-metals extension (recommended)",
      "Remove remove coc-scala",
      "Keep using coc-scala (NOT recommended)"
    ], "coc-scala is deprecated! Choose one of these actions")

    // await workspace.showMessage("" + choice)
    await new Promise((resolve) => setTimeout(resolve, 500))

    switch (choice) {
      case 0:
        await extensions.uninstallExtension(['coc-scala'])
        await extensions.installExtensions(['coc-metals'])
        return
      case 1:
        await extensions.uninstallExtension(['coc-scala'])
        return
      case 2:
        workspace.getConfiguration().update('scala', { ...config, keepUsing: true }, true)
    }
  }

  const serverOptions: ServerOptions = {
    command: (config.binaryPath || await pkgBin('metals-vim')),
    args: ['start'],
    transport: TransportKind.stdio
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['scala', 'sbt']
  }

  const client = new LanguageClient('scala', 'metals', serverOptions, clientOptions)

  context.subscriptions.push(
    services.registLanguageClient(client),
    commands.registerCommand("scala.version", async () => {
      const rootDir = await pkgDir(__dirname)
      const v = require(path.resolve(rootDir, 'package.json')).version
      // TODO scala version
      // TODO mentals version
      workspace.showMessage(`Version: ${v} [node: ${process.versions.node}]`, 'more')
    })
  )
}

async function pkgBin(name: string): Promise<string> {
  const rootDir = await pkgDir(__dirname)
  let bin = path.join(rootDir, 'bin', name)
  try {
    bin = fs.realpathSync(bin)
  } catch (e) {
    // ignore
  }

  return bin
}

