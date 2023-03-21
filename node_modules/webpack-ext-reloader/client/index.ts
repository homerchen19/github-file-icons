import * as minimist from "minimist";
import { install } from "source-map-support";
import { log } from "util";
import argsParser from "./args-parser";
import { SIG_EXIT } from "./events.constants";
import ExtensionCompiler from "./ExtensionCompiler";

install();
const { _, ...args } = minimist(process.argv.slice(2));

try {
  const { webpackConfig, pluginOptions } = argsParser(args);
  const compiler = new ExtensionCompiler(webpackConfig, pluginOptions);
  compiler.watch();
} catch (err) {
  if (err.type === SIG_EXIT) {
    process.exit(err.payload);
  } else {
    log(err);
    process.exit(err.code);
  }
}
