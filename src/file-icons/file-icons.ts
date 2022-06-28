import * as icondb from './db/icondb';
import type { IconColor, IconBase, IconDb, IconDbItem } from './types';

interface Cache {
  directoryName: Record<string, Icon>;
  directoryPath: Record<string, Icon>;
  fileName: Record<string, Icon>;
  filePath: Record<string, Icon>;
  interpreter: Record<string, Icon>;
  scope: Record<string, Icon>;
  language: Record<string, Icon>;
  signature: Record<string, Icon>;
}

const cache: Cache = {
  directoryName: {},
  directoryPath: {},
  fileName: {},
  filePath: {},
  interpreter: {},
  scope: {},
  language: {},
  signature: {},
};

/**
 * Icon
 *
 * @see {@link https://github.com/websemantics/file-icons-js/blob/master/index.js#L1107}
 */

/**
 * Create Icon instance
 */
class Icon {
  /** Index of the icon's appearance in the enclosing array */
  index: number;
  /** Icon's CSS class (e.g., "js-icon") */
  icon: string;
  /** Icon's color classes */
  color: IconColor;
  /** Pattern for matching names or pathnames */
  match: RegExp;
  /** priority that determined icon's order of appearance */
  priority = 1;
  /** Match against system path instead of basename */
  matchPath = false;
  /** to match executable names in hashbangs */
  interpreter: RegExp | null = null;
  /** to match grammar scope-names */
  scope: RegExp | null = null;
  /** to match alias patterns */
  lang: RegExp | null = null;
  /** to match file signatures */
  signature: RegExp | null = null;

  constructor(index: number, data: IconBase) {
    this.index = index;
    this.icon = data[0];
    this.color = data[1];
    this.match = data[2];
    this.priority = data[3] || 1;
    this.matchPath = data[4] || false;
    this.interpreter = data[5] || null;
    this.scope = data[6] || null;
    this.lang = data[7] || null;
    this.signature = data[8] || null;
  }

  /**
   * Return the CSS classes for displaying the icon.
   *
   * @param {Number|null} colorMode
   * @param {Boolean} asArray
   * @return {String}
   */
  getClass(colorMode?: number | null, asArray?: boolean) {
    colorMode = colorMode !== undefined ? colorMode : null;
    asArray = asArray !== undefined ? asArray : false;

    // No color needed or available
    if (colorMode === null || this.color[0] === null)
      return asArray ? [this.icon] : this.icon;

    return asArray
      ? [this.icon, this.color[colorMode]]
      : this.icon + ' ' + this.color[colorMode];
  }
}

/* ---------------------------------------------------------------------------
 * IconTables
 * ------------------------------------------------------------------------- */
interface IconTable {
  byName: Icon[];
  byInterpreter: Icon[];
  byLanguage: Icon[];
  byPath: Icon[];
  byScope: Icon[];
  bySignature: Icon[];
}

/**
 * Create IconTables instance
 */
class IconTables {
  /** Icons to match directory-type resources. */
  directoryIcons: IconTable;
  /** Icons to match file resources. */
  fileIcons: IconTable;
  /** Icon for binary files. */
  binaryIcon: Icon | null;
  /** Icon for executables. */
  executableIcon: Icon | null;

  constructor(data: IconDb) {
    this.directoryIcons = this.read(data[0]);
    this.fileIcons = this.read(data[1]);
    this.binaryIcon = this.matchScope('source.asm');
    this.executableIcon = this.matchInterpreter('bash');
  }

  /**
   * Populate icon-lists from a icons data table.
   */
  read(table: IconDbItem): IconTable {
    const [rawIcons, rawIndexes] = table;

    const icons = rawIcons.map((icon, index) => new Icon(index, icon));

    // Dereference Icon instances from their stored offset
    const indexes = rawIndexes.map((index) =>
      index.map((offset) => icons[offset])
    );

    return {
      byName: icons,
      byInterpreter: indexes[0],
      byLanguage: indexes[1],
      byPath: indexes[2],
      byScope: indexes[3],
      bySignature: indexes[4],
    };
  }

  /**
   * Match an icon using a resource's basename.
   *
   * @param name - Name of filesystem entity
   * @param directory - Match folders instead of files
   */
  matchName(name: string, directory = false): Icon | null {
    directory = directory !== undefined ? directory : false;
    const cachedIcons: Record<string, Icon> = directory
      ? cache.directoryName
      : cache.fileName;
    const icons = directory
      ? this.directoryIcons.byName
      : this.fileIcons.byName;

    if (cachedIcons[name]) {
      return cachedIcons[name];
    }

    for (const i in icons) {
      const icon = icons[i];
      if (icon.match.test(name)) return (cachedIcons[name] = icon);
    }

    return null;
  }

  /**
   * Match an icon using a resource's system path.
   *
   * @param path - Full pathname to check
   * @param directory - Match folders instead of files
   */
  matchPath(path: string, directory = false): Icon | null {
    directory = directory !== undefined ? directory : false;
    const cachedIcons = directory ? cache.directoryName : cache.fileName;
    const icons = directory
      ? this.directoryIcons.byPath
      : this.fileIcons.byPath;

    if (cachedIcons[path]) {
      return cachedIcons[path];
    }

    for (const i in icons) {
      const icon = icons[i];
      if (icon.match.test(path)) return (cachedIcons[path] = icon);
    }

    return null;
  }

  /**
   * Match an icon using the human-readable form of its related language.
   *
   * Typically used for matching modelines and Linguist-language attributes.
   *
   * @example IconTables.matchLanguage("JavaScript")
   * @param name - Name/alias of language
   */
  matchLanguage(name: string) {
    if (cache.language[name]) return cache.language[name];

    for (const i in this.fileIcons.byLanguage) {
      const icon = this.fileIcons.byLanguage[i];
      if (icon.lang?.test(name)) {
        return (cache.language[name] = icon);
      }
    }

    return null;
  }

  /**
   * Match an icon using the grammar-scope assigned to it.
   *
   * @example IconTables.matchScope("source.js")
   * @param {String} name
   * @return {Icon}
   */
  matchScope(name: string): Icon | null {
    if (cache.scope[name]) return cache.scope[name];

    for (const i in this.fileIcons.byScope) {
      const icon = this.fileIcons.byScope[i];
      if (icon.scope?.test(name)) return (cache.scope[name] = icon);
    }

    return null;
  }

  /**
   * Match an icon using the name of an interpreter which executes its language.
   *
   * Used for matching interpreter directives (a.k.a., "hashbangs").
   *
   * @example IconTables.matchInterpreter("bash")
   */
  matchInterpreter(name: string) {
    if (cache.interpreter[name]) return cache.interpreter[name];

    for (const i in this.fileIcons.byInterpreter) {
      const icon = this.fileIcons.byInterpreter[i];
      if (icon.interpreter?.test(name)) {
        return (cache.interpreter[name] = icon);
      }
    }

    return null;
  }
}

/* ---------------------------------------------------------------------------
 * FileIcons
 * ------------------------------------------------------------------------- */

export const db = new IconTables(icondb);

/**
 * Get icon class name of the provided filename. If not found, default to text icon.
 *
 * @param name - file name
 * @return the icon's class
 * @public
 */
export const getClass = (name: string, match = db.matchName(name)) =>
  match ? match.getClass() : null;

/**
 * Get icon class name of the provided filename with color. If not found, default to text icon.
 *
 * @param name - file name
 * @return the icon's class
 * @public
 */
export const getClassWithColor = (name: string, match = db.matchName(name)) =>
  match ? match.getClass(0) : null;

/**
 * Get icon class name of the provided filename with dark color. If not found, default to text icon.
 *
 * @param name - file name
 * @return the icon's class
 * @public
 */
export const getClassWithDarkColor = (
  name: string,
  match = db.matchName(name)
) => (match ? match.getClass(1) : null);
