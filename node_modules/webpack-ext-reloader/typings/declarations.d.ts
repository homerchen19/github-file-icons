declare type ActionType = string;
declare interface IAction {
  type: ActionType;
  payload?: any;
}
declare type ActionFactory = (payload?: any) => IAction;

declare interface IMiddlewareTemplateParams {
  port: number;
  reloadPage: boolean;
}

declare type InjectMiddleware = (
  assets: Record<string, any>,
  chunks: Set<any>,
) => Record<string, any>;

declare type MiddlewareInjector = (
  { background, contentScript, extensionPage }: IEntriesOption,
  { port, reloadPage }: IMiddlewareTemplateParams,
) => InjectMiddleware;

declare type Triggerer = (onlyPageChanged: boolean) => Promise<any>;

declare type TriggererFactory = (
  port: number,
  reloadPage: boolean,
) => Triggerer;

declare type VersionPair = [number | undefined, number | undefined];

declare interface IEntriesOption {
  background: string;
  contentScript: ContentScriptOption;
  extensionPage?: ExtensionPageOption;
}

declare type ContentScriptOption = string | string[] | null;
declare type ExtensionPageOption = string | string[] | null;

declare type LOG_NONE = 0;
declare type LOG_LOG = 1;
declare type LOG_INFO = 2;
declare type LOG_WARN = 3;
declare type LOG_ERROR = 4;
declare type LOG_DEBUG = 5;

declare type LOG_LEVEL =
  | LOG_NONE
  | LOG_LOG
  | LOG_INFO
  | LOG_WARN
  | LOG_ERROR
  | LOG_DEBUG;

declare interface IWebpackChunk {
  files: string[];
  name: string;
  hash: string;
}

declare interface IClientEvent {
  type: string;
  payload: any;
}

declare type BrowserVersion = [number, number, number];

declare interface IExtensionManifest {
  manifest_version: string;
  name: string;
  version: string;
  background?: {
    page?: string;
    scripts?: string[];
  };
  icons?: {
    [key: string]: string;
  };
  browser_action?: {
    default_popup: string;
  };
  content_scripts?: [
    {
      matches: string[];
      js: string[];
      css: string[];
    },
  ];
}
