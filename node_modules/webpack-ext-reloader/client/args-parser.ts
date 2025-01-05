/* eslint-disable no-throw-literal */
import { resolve } from 'path';
import { cwd } from 'process';
import { log } from 'util';
import { DEFAULT_CONFIG, DEFAULT_PORT } from '../src/constants/options.constants';
import { IPluginOptions } from '../typings/webpack-ext-reloader';
import { CONFIG, HELP, MANIFEST, NO_PAGE_RELOAD, PORT } from './args.constant';
import { SIG_EXIT } from './events.constants';
import manual from './manual';

export default (args: object) => {
  if (args[HELP]) {
    log(manual());
    throw { type: SIG_EXIT, payload: 0 };
  }

  const config = args[CONFIG] || DEFAULT_CONFIG;
  const port = args[PORT] || DEFAULT_PORT;
  const manifest = args[MANIFEST] || null;

  const pluginOptions: IPluginOptions = {
    manifest,
    port,
    reloadPage: !args[NO_PAGE_RELOAD],
  };

  const optPath = resolve(cwd(), config);

  try {
    // eslint-disable-next-line no-eval
    const webpackConfig = eval('require')(optPath);
    return { webpackConfig, pluginOptions };
  } catch (err) {
    log(`[Error] Couldn't require the file: ${optPath}`);
    log(err);
    throw { type: SIG_EXIT, payload: 1 };
  }
};
