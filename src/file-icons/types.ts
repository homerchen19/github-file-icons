export type IconColor = [string | null, string | null];

export type IconBase = [
  /** Icon's CSS class (e.g., "js-icon") */
  string,
  /** Icon's color CSS classes for light and dark mode */
  IconColor,
  /** Pattern for matching names or pathnames */
  RegExp,
  /** priority that determined icon's order of appearance */
  number?,
  /** Match against system path instead of basename */
  boolean?,
  /** to match executable names in hashbangs */
  RegExp?,
  /** to match grammar scope-names */
  RegExp?,
  /** to match alias patterns */
  RegExp?,
  /** to match file signatures */
  RegExp?
];

export type IconDbItem = [IconBase[], number[][], Record<string, number>];

export type IconDb = IconDbItem[];
