import https from 'https';
import { existsSync, createWriteStream, promises as fsPromises } from 'fs';
import rimraf from 'rimraf';
import childProcess from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs/promises';

const exec = promisify(childProcess.exec);

/**
 * Check if a directory exists, and if it does not, create it
 *
 * @param {string} dir The path of the directory to create
 */
async function mkdir(dir) {
  if (!existsSync(dir)) {
    await fsPromises.mkdir(dir, { recursive: true });
  }
}

/**
 * Remove a file or directory
 *
 * @param {string} filePath The source folder/file path
 * @param {object} opts The options to pass to rimraf https://www.npmjs.com/package/rimraf#options
 * @returns {Promise} A promise which throws if the process fails
 */
function rm(filePath, opts = {}) {
  const defaultOpts = { glob: false };

  return new Promise((resolve, reject) => {
    rimraf(filePath, { ...defaultOpts, ...opts }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

/**
 * Download a file from a URL to a local path
 *
 * @param {object} file The file to download
 * @param {string} file.url The URL to download from
 * @param {string} file.path The local path to save the file to
 * @returns {Promise} A promise which throws if the process fails
 */
function downloadFile(file) {
  return new Promise((resolve, reject) => {
    rm(file.path).then(() => {
      const writeStream = createWriteStream(file.path);
      https
        .get(file.url, (response) => {
          response.pipe(writeStream);
          writeStream.on('finish', () => {
            console.info(`Finished downloading file: ${file.path}`);
            resolve();
          });
        })
        .on('error', (err) => {
          // Handle errors
          rimraf(file.path); // Delete the file async. (But we don't check the result)
          reject(err);
        });
    });
  });
}

/**
 * Download the less stylesheets for the file-icons package and compile them to css
 *
 * @see https://github.com/file-icons/atom/tree/master/styles
 */
const downloadStyles = async () => {
  const styles = [
    {
      url: 'https://raw.githubusercontent.com/file-icons/atom/master/styles/colours.less',
      path: 'tmp/colors.less',
      finalPath: 'src/file-icons/css/colors.css',
    },
    {
      url: 'https://raw.githubusercontent.com/file-icons/atom/master/styles/icons.less',
      path: 'tmp/icons.less',
      finalPath: 'src/file-icons/css/icons.css',
    },
    {
      url: 'https://raw.githubusercontent.com/file-icons/atom/master/styles/mixins.less',
      path: 'tmp/mixins.less',
    },
  ];

  await mkdir('tmp');

  await Promise.all(styles.map((style) => downloadFile(style)));
  console.log('Finished downloading all styles');

  const stylesToCompile = styles.filter((style) => style.finalPath);

  await Promise.all(
    stylesToCompile.map((style) => {
      const cmd = ['lessc', style.path, style.finalPath].join(' ');
      return exec(cmd);
    })
  );
  console.log('Finished compiling all styles');

  await rm('tmp');
};

/**
 * Download the file-icons mapping database file from github
 */
const downloadDb = async () => {
  await mkdir('src/file-icons/db');

  const icondb = {
    url: 'https://raw.githubusercontent.com/file-icons/atom/master/lib/icons/.icondb.js',
    path: 'src/file-icons/db/icondb.js',
  };

  await downloadFile(icondb);
  console.log('Finished downloading icondb');

  const dbFile = await readFile(icondb.path, 'utf8');
  const newDbFile = dbFile.replace(/\(\?<?=(.+?)(?<!\\)\)/g, '($1)');
  await writeFile(icondb.path, newDbFile);
  console.log('Finished modifying icondb');
};

/**
 * Download the font files used in the file-icons package from github
 */
const downloadFonts = async () => {
  const fonts = [
    {
      url: 'https://raw.githubusercontent.com/file-icons/vscode/master/icons/devopicons.woff2',
      path: 'src/file-icons/fonts/devopicons.woff2',
    },
    {
      url: 'https://raw.githubusercontent.com/file-icons/vscode/master/icons/file-icons.woff2',
      path: 'src/file-icons/fonts/file-icons.woff2',
    },
    {
      url: 'https://raw.githubusercontent.com/file-icons/vscode/master/icons/fontawesome.woff2',
      path: 'src/file-icons/fonts/fontawesome.woff2',
    },
    {
      url: 'https://raw.githubusercontent.com/file-icons/vscode/master/icons/mfixx.woff2',
      path: 'src/file-icons/fonts/mfixx.woff2',
    },
    {
      url: 'https://raw.githubusercontent.com/file-icons/vscode/master/icons/octicons.woff2',
      path: 'src/file-icons/fonts/octicons.woff2',
    },
  ];

  await mkdir('src/file-icons/fonts');

  await Promise.all(fonts.map((font) => downloadFile(font)));
  console.log('Finished downloading fonts');
};

const updateAssets = async () => {
  await downloadStyles();
  await downloadDb();
  await downloadFonts();
};

updateAssets();
