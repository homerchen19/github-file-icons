import { Compiler } from "webpack";

export interface IPluginOptions {
  port: number;
  reloadPage: boolean;
  manifest?: string;
  entries?: IEntriesOption;
}

export interface IExtensionReloaderInstance {
  apply(compiler: Compiler): void;
}

export type ExtensionReloader = new (options?: IPluginOptions) => IExtensionReloaderInstance;

declare module "webpack-extension-reloader" {
  export default ExtensionReloader;
  export = IExtensionReloaderInstance;
}
