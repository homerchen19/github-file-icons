declare module "*.json" {
  const json: any;
  export = json;
}

declare module "*.txt" {
  const text: string;
  export = text;
}

declare module "*.source.ts" {
  const sourceCode: string;
  export = sourceCode;
}

declare module "raw-loader!*" {
  const rawText: string;
  export default rawText;
}
