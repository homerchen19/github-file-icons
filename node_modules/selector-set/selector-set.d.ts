declare module 'selector-set' {
  interface ISelectorSetIndex {
    name: string;
    selector: (selector: string) => string | void;
    element: (el: Element) => Array<string> | void;
  }

  class SelectorSet<T> {
    size: number;

    matchesSelector: (el: Element, selector: string) => boolean;
    querySelectorAll: (selectors: string, context: Element) => Array<Element>;

    indexes: Array<ISelectorSetIndex>;

    add(selector: string, data: T): void;
    remove(selector: string, data?: T): void;

    matches(el: Element): Array<{ selector: string; data: T }>;
    queryAll(
      context: Element
    ): Array<{ selector: string; data: T; elements: Array<Element> }>;

    logDefaultIndexUsed: ({
      selector,
      data
    }: {
      selector: string;
      data: T;
    }) => void;
  }

  export default SelectorSet;
}
