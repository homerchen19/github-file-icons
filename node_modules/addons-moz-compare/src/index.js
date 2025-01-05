(function addonsMozCompare() {
  const compareParts = (partA, partB) => {
    if (partA === partB) {
      return 0;
    }

    return partA > partB ? 1 : -1;
  };

  // This isn't strictly a bytewise comparison but it has conditions that
  // `compareParts()` does not have.
  const compareByteWiseParts = (partA, partB) => {
    if (!partA) {
      return partB ? 1 : 0;
    }

    if (!partB) {
      return -1;
    }

    return compareParts(partA, partB);
  };

  const compareVersionParts = (versionPartA, versionPartB) => {
    // Parts A and C are compared as numbers.
    let retval = compareParts(versionPartA.a, versionPartB.a);

    if (retval !== 0) {
      return retval;
    }

    // Parts B and D are compared byte-wise.
    retval = compareByteWiseParts(versionPartA.b, versionPartB.b);

    if (retval !== 0) {
      return retval;
    }

    // Parts A and C are compared as numbers.
    retval = compareParts(versionPartA.c, versionPartB.c);

    if (retval !== 0) {
      return retval;
    }

    // Parts B and D are compared byte-wise.
    return compareByteWiseParts(versionPartA.d, versionPartB.d);
  };

  const parsePart = (part) => {
    // Normalize leading zero if needed.
    if (!part || /^0+$/.test(part.toString())) {
      return 0;
    }

    return parseInt(part, 10) || part;
  };

  const parseVersionPart = (versionPart) => {
    // Each version part is itself parsed as a sequence of four parts:
    // <number-a><string-b><number-c><string-d>. Each of the parts is optional.
    // Numbers are integers base 10 (may be negative), strings are non-numeric
    // ASCII characters.

    // Missing version parts are treated as if they were 0.
    const parts = { a: 0, b: 0, c: 0, d: 0 };

    if (!versionPart) {
      return parts;
    }

    // If the version part is a single asterisk, it is interpreted as an
    // infinitely-large number.
    if (versionPart === '*') {
      parts.a = Infinity;

      return parts;
    }

    parts.a = parseInt(versionPart, 10);

    let nextPartPosition =
      versionPart.indexOf(parts.a.toString()) + parts.a.toString().length;

    const rest = versionPart.substr(nextPartPosition);

    // If string-b is a plus sign, number-a is incremented to be compatible with
    // the Firefox 1.0.x version format.
    if (rest[0] === '+') {
      parts.a += 1;
      parts.b = 'pre';
    } else if (rest.startsWith('pre')) {
      parts.b = 'pre';

      parts.c = parsePart(rest.substr(3));
    } else if (rest) {
      parts.b = parsePart(rest);
    }

    if (parts.c) {
      parts.d = parsePart(
        rest.substr(parts.b.toString().length + parts.c.toString().length)
      );
    }

    return parts;
  };

  /**
   * Compare two version strings according to
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version/format
   *
   * @param   versionA the first version
   * @param   versionB the second version
   * @returns -1 if A < B
   *           0 if A == B
   *           1 if A > B
   */
  const mozCompare = (versionA, versionB) => {
    const partsA = versionA.split('.');
    const partsB = versionB.split('.');

    const maxParts = Math.max(partsA.length, partsB.length);

    // When two version strings are compared, their version parts are compared
    // left to right. An empty or missing version part is equivalent to 0.
    for (let i = 0; i < maxParts; i++) {
      const versionPartA = parseVersionPart(partsA[i]);
      const versionPartB = parseVersionPart(partsB[i]);

      const retval = compareVersionParts(versionPartA, versionPartB);

      if (retval !== 0) {
        return retval;
      }
    }

    return 0;
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      mozCompare,
      parseVersionPart,
    };
  } else if (typeof window !== 'undefined') {
    window.mozCompare = mozCompare;
  }
})();
