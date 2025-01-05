import { Compiler } from 'webpack';

export interface IPluginOptions {
  port: number;
  reloadPage: boolean;
  manifest?: string;
  entries?: IEntriesOption;
}

export interface IExtensionReloaderInstance {
  apply(compiler: Compiler): void;
}

export declare class ExtensionReloader implements IExtensionReloaderInstance {
  constructor(options?: IPluginOptions);

  apply(compiler: Compiler): void;
}

export default ExtensionReloader;

declare module 'webpack-ext-reloader' {
  export default ExtensionReloader;
  export = IExtensionReloaderInstance;
}
